import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly'

export
function init_polly(key_id: string, key_secret: string) {
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

    async function synthesize(text: string) {
        const cmd = make_command(text)
        return await polly_client.send(cmd)
    }

    return {
        make_command,
        synthesize,
    }
}
