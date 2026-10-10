# Defer the Rust video-processor; the Go API owns processing for the MVP

`services/video-processor` is a Rust stub, and the build machine has no Rust toolchain. For the MVP the Go API runs the Video lifecycle in-process: a database-backed queue plus a worker pool that calls Recipe generation. The Rust scaffold is left untouched. If processing later needs heavy media work (transcoding, frame sampling, transcription), it can move out to that service behind the same queue.
