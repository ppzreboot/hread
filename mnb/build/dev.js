import { createServer } from 'http'
import log from './log.js'
import fs from 'fs'
import path from 'path'
import serve from 'serve-handler'
import { run_onchange } from './run-onchange.js'

main()

function main() {
    const serve_port = 8866
    const compiled_dir = workspace_dir('dist')
    const jobs = [
        {
            name: 'Copy App Asset',
            workspace_dir: workspace_dir('mnb'),
            src_dir: 'asset',
            cmd: 'cp -r ./asset/* ' + compiled_dir,
        },
        {
            name: 'Build Port: Voice',
            workspace_dir: workspace_dir('port/voice'),
            src_dir: 'src',
            cmd: 'npm run build & mv ./dist ' + compiled_dir + '/port/voice',
        },
        {
            name: 'Build Elm App',
            workspace_dir: workspace_dir('app'),
            src_dir: 'src',
            cmd: './build.sh & mv ./dist/main.js ' + compiled_dir + '/main.js',
        }
    ]

    setup_compiled_dir()
    serve_compiled_dir(serve_port)
    for (const job of jobs)
        run_onchange(job.name, job.workspace_dir, job.src_dir, job.cmd)

    function setup_compiled_dir() {
        fs.rmSync(compiled_dir, { recursive: true, force: true })
        fs.mkdirSync(compiled_dir)
        fs.mkdirSync(compiled_dir + '/port')
        log.app.inf(`Compiled dir: ${compiled_dir}`)
    }
    function serve_compiled_dir(port) {
        createServer((req, res) => {
            serve(req, res, {
                public: compiled_dir,
                headers: [
                    {
                        source: '**/*',
                        headers: [
                            { key: 'Cache-Control', value: 'no-cache' },
                            { key: 'Expires', value: '0' },
                        ]
                    }
                ]
            })
        }).listen(port, () => {
            log.app.inf(`Serving compiled files at http://localhost:${port}`)
        })
    }
}



function workspace_dir(r) {
    return path.join(import.meta.dirname, '../..', r)
}
