import { serveDir } from '@std/http/file-server'
import { resolve as resolve_path } from "@std/path/resolve"
import log from './log.ts'
import { I_mod, wnb } from './watch-n-build.ts'
import { remove_dir } from './utils.ts'

main()

async function main() {
    const serve_port = 8866
    const compiled_dir = workspace_dir('dist')
    const jobs: I_mod[] = [
        {
            name: 'Port - Voice',
            key: 'voice',
            type: 'port',
        },
        {
            name: 'App',
            key: 'app',
            type: 'elm-app',
        },
    ]

    await setup_compiled_dir()
    await cp_assets() // html...
    for (const job of jobs)
        wnb(job)
    serve_compiled_dir(serve_port)

    async function setup_compiled_dir() {
        await remove_dir(compiled_dir)
        await Deno.mkdir(compiled_dir + '/port', { recursive: true })
        log.app.inf(`Compiled dir: ${compiled_dir}`)
    }

    function serve_compiled_dir(port: number) {
        Deno.serve(
            { port },
            async req =>
                await serveDir(req, {
                    fsRoot: compiled_dir,
                })
            ,
        )
        // log.app.inf(`Serving compiled files at http://localhost:${port}`)
    }
}

function workspace_dir(r: string) {
    const dirname = import.meta.dirname
    if (dirname === undefined)
        throw Error('NO DIRNAME')
    return resolve_path(dirname, '../..', r)
}

async function cp_assets() {
    await Deno.copyFile(workspace_dir('mnb/asset/index.html'), workspace_dir('dist/index.html'))
}
