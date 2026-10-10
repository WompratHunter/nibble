# SQLite (pure Go driver) for API storage

The API stores everything in SQLite through `modernc.org/sqlite`, with embedded, ordered SQL migrations applied at startup. It needs no external service and no cgo, so the API and its tests run on any machine with only the Go toolchain. Postgres was rejected for the MVP because it adds infrastructure nobody is around to run. Keep SQL portable (no SQLite-only features beyond what migrations need) so a later move to Postgres stays a driver-and-migration change.
