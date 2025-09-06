import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly'

export
function init_polly() {
    const key_id = Deno.env.get('AWS_POLLY_KEY')
    const key_secret = Deno.env.get('AWS_POLLY_SECRET')
    if (!key_id || !key_secret)
        throw Error('missing AWS_POLLY_KEY or AWS_POLLY_SECRET env var')

    const polly_client = new PollyClient({
        region: 'ap-northeast-1',
        credentials: {
            accessKeyId: key_id,
            secretAccessKey: key_secret,
        }
    })

    function make_command(text: string) {
        return new SynthesizeSpeechCommand({
            Text: text,

            Engine: 'neural',
            LanguageCode: 'ja-JP',
            OutputFormat: 'mp3',
            SampleRate: '44100',
            TextType: 'text',
            VoiceId: 'Takumi',
        })
    }

    return async function synthesize_by_polly(text: string) {
        const cmd = make_command(text)
        const res = await polly_client.send(cmd)
        return res.AudioStream as ReadableStream
    }
}
