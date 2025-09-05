import { bad_request, not_found } from '../utils/request/respond.ts'

export
async function synthesize(
    _: URL,
    req: Request,
    synthesize_by_polly: (text: string) => Promise<ReadableStream>
): Promise<Response> {
    switch(req.method) {
        case 'POST':
            return await synthesize_speech(req, synthesize_by_polly)
        default:
            return not_found()
    }
}

async function synthesize_speech(
    req: Request,
    synthesize_by_polly: (text: string) => Promise<ReadableStream>,
): Promise<Response> {
    const data = await req.json()
    if (typeof data.text !== 'string' || data.text.trim() === '')
        return bad_request('what to synthesize?')
    const audio_stream = await synthesize_by_polly(data.text)
    return new Response(audio_stream, {
        headers: {
            'Content-Type': 'audio/mpeg',
        }
    })
}
