import { init_polly } from './polly.js'

type I_elm_port_publisher<M> = {
    subscribe: (callback: (msg: M) => void) => void
}
type I_elm_port_subscriber<M> = {
    send: (msg: M) => void
}

interface I_elm_ports {
    /** elm 发来 text，在此处 synthesize 并 play */
    synthesize_speech: I_elm_port_publisher<string>
    polly_ready: I_elm_port_subscriber<number>
}

export default
function init_voice_port(ports: I_elm_ports) {
    const polly = init_polly('', '')
    ports.synthesize_speech.subscribe(async text => {
        console.log('received job to synthesize:', text)
        const synthesized = await polly.synthesize(text)
        const voice_ba = await synthesized.AudioStream.transformToByteArray()
        const blob = new Blob([voice_ba], { type: synthesized.ContentType })
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.play()
    })
    ports.polly_ready.send(1)
}

function init_player() {
    const audio = new Audio
}
