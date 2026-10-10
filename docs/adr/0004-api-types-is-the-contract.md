# `packages/api-types` is the canonical API contract

The TypeScript package `api-types` defines every request and response shape. The mobile app imports it directly (its old local feed types are removed). The Go API mirrors the shapes by hand with matching JSON tags, and Go handler tests assert the JSON field names and omissions. We rejected generating code from OpenAPI because it adds a toolchain and a build step for a small surface; revisit when the API grows.
