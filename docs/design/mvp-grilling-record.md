# MVP Design — Grilling Record

Autonomous grilling session (2026-10-10). Every question was answered with the
recommended option, per the project owner's instruction. This record is the
input to the spec (`/to-spec`) and ticket (`/to-tickets`) stages.

## Starting state (facts gathered from the repo)

- Nx monorepo: `apps/mobile` (Expo 54 / RN 0.81 / Expo Router), `apps/api`
  (Go module, empty `internal/{auth,feed,recipe,video}`), `packages/api-types`
  (TS contract: `User`, `AuthResponse`, `Video`, `VideoUploadRequest/Response`,
  `Recipe`, `Ingredient`, `RecipeStep`, `FeedItem`, `FeedResponse`),
  `services/video-processor` (Rust hello-world).
- Mobile has a working vertical video **Feed** backed by a local JSON fixture
  and `expo-av`. The cookbook button logs to console. Profile tab is empty.
  The mobile app's local `FeedItem` type diverges from `api-types`.
- No test runner is configured for any project. No CI workflow exists.
- Toolchain on the build machine: Node 24, Go 1.27, Xcode/Swift. **No Rust
  toolchain** (cargo absent).

## Round 1

**Q1 – Scope of this milestone.** (a) Mobile polish only; (b) MVP vertical
slice across mobile + API; (c) full product incl. social graph, comments, etc.
➡️ **(b)**: an end-to-end MVP that delivers the README promise — film a
video, get a recipe, build a cookbook — with a real Go API behind the app.

**Q2 – "Apple best practices and Swift standards" vs. an RN codebase.**
Rewrite in SwiftUI, or keep Expo and apply Apple's guidelines?
➡️ **Keep Expo/RN. No Swift rewrite.** Reviewers enforce Apple Human
Interface Guidelines in the RN UI (≥44pt hit targets, safe areas, Dynamic
Type-friendly text, VoiceOver labels/roles, dark-mode-safe colours, native
share sheet, haptics, system-standard modal/sheet presentation) and the
idiomatic standards of each language (strict TS, effective Go). Swift is only
written if a native module is unavoidable (none is expected). → ADR-0001.

**Q3 – API persistence.** Postgres, SQLite, or in-memory?
➡️ **SQLite via the pure-Go `modernc.org/sqlite` driver**, schema managed by
embedded, ordered SQL migrations applied at startup. No external services,
no cgo, tests run anywhere with a temp DB file. → ADR-0002.

**Q4 – Rust video-processor service.** cargo is not installed.
➡️ **Defer it.** Leave the scaffold untouched. The Go API owns the
processing pipeline in-process for the MVP. → ADR-0003.

**Q5 – Authentication.** None / dev header / real auth?
➡️ **Real but minimal**: email + password registration and login, bcrypt
hashes, short-lived JWT access tokens (HS256, secret from env) and opaque
rotating refresh tokens stored hashed in the DB. Matches existing
`AuthResponse`. Mobile stores tokens in `expo-secure-store` (Keychain on iOS).

**Q6 – Video storage and upload.**
➡️ API issues an **upload URL** (per existing `VideoUploadResponse`) that
points back at the API itself (single-use, expiring token). Bytes go to a
`BlobStore` interface with a local-disk implementation; the API serves stored
videos over HTTP with range support (`http.ServeContent`) so iOS AVPlayer can
stream them. S3 is a future `BlobStore`.

**Q7 – Video playback library.** `expo-av` is deprecated as of SDK 54.
➡️ **Migrate to `expo-video`** before building new video features
(prefactor).

**Q8 – Testing infrastructure.**
➡️ Mobile: `jest-expo` preset + `@testing-library/react-native`, wired as an
Nx `test` target. Go: standard `testing` + `httptest`, wired as Nx targets
(`test` = `go test ./...`, `lint` = `go vet ./...`, `build`). Add a GitHub
Actions workflow running lint, typecheck and tests for all projects on PRs
to `main` and `dev/test`. Every ticket ships its own tests.

**Q9 – Mobile ↔ API contract.**
➡️ **`packages/api-types` is canonical.** Mobile imports from it and drops its
divergent local `FeedItem`. Go structs are hand-mirrored with matching JSON
tags, and Go handler tests assert the JSON shape (camelCase, optional fields
omitted). → ADR-0004.

**Q10 – Mobile data source.**
➡️ An `ApiClient` module (base URL from `EXPO_PUBLIC_API_URL`) handles auth
headers and silent token refresh. Services (`feed`, `recipes`, `videos`,
`auth`, `cookbook`) sit on top. Tests mock at the `fetch` boundary.

## Round 2 (unlocked by Round 1)

**Q11 – How does a video become a recipe?**
➡️ **Video lifecycle**: `awaiting_upload → processing → ready | failed`.
Completing an upload enqueues the video; an in-process worker pool picks up
`processing` videos (DB-backed queue, survives restarts), calls a
`RecipeGenerator`, stores the **Recipe**, and marks the video `ready` (or
`failed` with a reason). Add `status` (and optional `failureReason`) to the
`Video` contract. Only `ready` videos appear in the **Feed**.

**Q12 – What generates the recipe?** No API keys or ffmpeg available unattended.
➡️ `RecipeGenerator` interface with two implementations:
1. **Stub generator** (default): deterministic recipe derived from the
   video's title/description — makes the whole pipeline demoable and testable.
2. **Claude generator** (opt-in when `ANTHROPIC_API_KEY` is set): sends the
   title, description and the creator's optional **cooking notes** to the
   Claude Messages API with a structured-output schema matching `Recipe`.
   Frame/transcript extraction is out of scope. → ADR-0005.

**Q13 – What is the Cookbook?**
➡️ A user's **Cookbook** = recipes they **authored** (from their own videos)
+ recipes they **saved** from other creators. Save/unsave is the one social
action in scope. `likeCount`/`commentCount`/`isLiked` stay in the contract
but are returned as zero/false (likes and comments are out of scope).
Add `isSaved` to `FeedItem`.

**Q14 – Mobile navigation.**
➡️ Tabs: **Feed**, **Create**, **Cookbook** (replaces the empty Profile tab;
includes account header and sign-out). Recipe detail is a stack screen
presented as an iOS page sheet from the feed's cookbook button and from the
Cookbook grid. Auth screens (sign in / register) gate the tab group via an
auth context; unauthenticated users are redirected.

**Q15 – Capturing video.**
➡️ `expo-image-picker` in video mode (record with the system camera, or pick
from library), max duration 3 minutes, portrait. Requires
`NSCameraUsageDescription` / `NSMicrophoneUsageDescription` /
`NSPhotoLibraryUsageDescription` strings in app config. Create flow: pick →
title / description / optional cooking notes → upload with progress →
"processing" state that polls the video until `ready`, then opens the recipe.

**Q16 – Feed pagination.**
➡️ Cursor (keyset on `createdAt, id`), page size 10, newest first; mobile
fetches the next page when the active item is within 3 of the end. Pull to
refresh at the top.

**Q17 – Go HTTP stack and layout.**
➡️ Standard library only (`net/http` 1.22+ method/path patterns,
`log/slog`, `encoding/json`), plus `modernc.org/sqlite`,
`golang.org/x/crypto/bcrypt`, and a small JWT library
(`github.com/golang-jwt/jwt/v5`). Entry point `cmd/server`; packages per
domain under `internal/` (existing `auth`, `feed`, `recipe`, `video`) plus
`internal/store` (DB + migrations), `internal/blob`, `internal/httpapi`
(router, middleware, error envelope), `internal/config`. Config from env.
Errors use one JSON envelope `{ "error": { "code", "message" } }`.

**Q18 – Seed data.**
➡️ A `seed` command (dev only) creates a demo creator and several ready
videos + recipes, replacing the mobile JSON fixture as the source of truth.
The bundled `sad-papi.mp4` is copied into the seed blob store.

## Round 3 (unlocked by Round 2)

**Q19 – Recipe editing?** Generated recipes may be wrong.
➡️ **Yes, author-only edit** of title, description, servings, times,
ingredients and steps (PUT replaces the whole recipe). Non-authors see
read-only.

**Q20 – Sharing.**
➡️ Native share sheet (`Share` API) on recipe detail sharing a deep link
`nibble://recipes/{id}` plus a plain-text rendering of the recipe. Public web
pages and per-user public cookbooks are out of scope.

**Q21 – Accessibility & HIG checklist (review gate).**
➡️ Every interactive element has `accessibilityRole` + `accessibilityLabel`;
hit targets ≥ 44×44pt; text uses theme typography and respects font scaling;
content respects safe-area insets; colours come from `constants/theme.ts`;
destructive actions confirm; loading, empty and error states exist for every
data screen; haptics on primary actions via existing `HapticTab` pattern.

**Q22 – Parallelism and branch flow.**
➡️ Each ticket is implemented on its own branch off `dev/test` in an
isolated worktree, opened as a PR **into `dev/test`** (never `main`),
reviewed, merged, then validated. `main` is never touched.

## Frontier

Empty. All branches visited; nothing silently assumed beyond what is listed.
