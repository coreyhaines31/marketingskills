# MuAPI Video

Use the repository's zero-dependency CLI when a marketing workflow needs a hosted text-to-video
or image-to-video generation request through MuAPI. The helper discovers the selected model's
current public metadata before a live generation, validates the prompt/image/aspect-ratio shape,
submits one request, polls the returned prediction with a finite GET budget, and downloads the
first HTTPS video output without forwarding the API key.

## Requirements

- Node.js 18 or newer
- A MuAPI API key in `MUAPI_API_KEY`
- An approved prompt and a confirmed paid generation
- An HTTPS source image URL for image-to-video mode

Do not put the key in a command argument, source file, or output URL. Generation POSTs are not
automatically retried. If a submission times out ambiguously, keep the request ID and reconcile
the prediction instead of creating a second job.

## Discover and dry-run

```bash
node tools/clis/muapi-video.js models --model hunyuan-text-to-video

node tools/clis/muapi-video.js generate \
  --model hunyuan-text-to-video \
  --prompt "a close-up of a product box rotating on a clean studio turntable" \
  --aspect-ratio 16:9 --dry-run
```

The dry run performs no network call and does not require a key. Live generation retrieves the
current model metadata first, so the CLI does not silently rely on an old endpoint or field name.

## Generate and download

```bash
MUAPI_API_KEY=<key> node tools/clis/muapi-video.js generate \
  --model hunyuan-text-to-video \
  --prompt "a close-up of hands arranging fresh flowers, gentle camera slide, warm daylight" \
  --aspect-ratio 16:9 --output ./flower-demo.mp4
```

For image-to-video:

```bash
MUAPI_API_KEY=<key> node tools/clis/muapi-video.js generate \
  --model hunyuan-image-to-video \
  --image https://cdn.example.com/product-still.png \
  --prompt "slow camera push-in with natural product movement" \
  --output ./product-motion.mp4
```

Use `--no-poll` to submit once and retain the request ID, `--max-polls` to set a bounded result
budget, or `status --request-id <id>` to inspect a submitted job later.

## Official references

- [MuAPI AI Video API](https://muapi.ai/ai-video-api)
- [MuAPI model catalog](https://muapi.ai/docs/models)
- [MuAPI API reference](https://muapi.ai/docs/api-reference)
- [MuAPI access keys](https://muapi.ai/access-keys)
