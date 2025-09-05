import { synthesize } from './handler/synthesize.ts'
import { init_polly } from "./service/polly.ts";
import { failure, not_found } from './utils/request/respond.ts'

Deno.serve(async req => {
  const url = new URL(req.url)
  const synthesize_by_polly = init_polly()

  try {
    switch (url.pathname) {
      case '/synthesize':
        return await synthesize(url, req, synthesize_by_polly)
      default:
        return not_found()
    }
  } catch(e) {
    console.error(`[${req.method} ${url.pathname}] Uncaught Exception`)
    console.error(e)
    return failure(500, 'Internal Server Error')
  }
})
