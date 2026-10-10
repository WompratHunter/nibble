# Recipe generation is pluggable, with a deterministic stub as the default

Recipe generation sits behind a single generator interface. The default implementation is a deterministic stub built from the Video's title, description and Cooking notes, so the whole upload-to-Cookbook flow works and is testable without credentials. When `ANTHROPIC_API_KEY` is set, a Claude-backed generator turns the title, description and Cooking notes into a structured Recipe. Generating from the video's frames or audio is deferred: it needs media tooling (ffmpeg, transcription) the MVP does not have.
