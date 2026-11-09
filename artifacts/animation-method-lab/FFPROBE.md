# Fresh FFprobe results

| File | Streams | Dimensions | FPS | Duration | Bytes |
|---|---|---:|---:|---:|---:|
| `A.mp4` | H.264 video | 1080×1920 | 24 | 5.000s | 3,499,454 |
| `B.mp4` | H.264 video | 1080×1920 | 24 | 20.000s | 14,024,299 |
| `C-zh-voice.mp4` | H.264 video + AAC stereo 48kHz | 360×640 | 24 | 13.500s | 3,315,471 |

The probes were run with the locked `ffprobe-static@3.1.0` binary. Full encoding commands and FFmpeg output are retained in each media folder's `ffmpeg-render.log`.
