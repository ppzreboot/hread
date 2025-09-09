import { resolve as resolve_path } from '@std/path'
import log from './log.ts'
import { remkdir, remove_dir } from './utils.ts'

type I_mod_type = 'elm-app' | 'port'

export
interface I_mod {
    name: string
    key: string
    type: I_mod_type
    // mod_dir: string        // type_dir + key
    // src_dir?: string       // default to 'src'
    // compiled_dir?: string  // default to 'dist'
}

if (!import.meta.dirname)
    throw Error('Wield Environtment')
const root_workspace = resolve_path(import.meta.dirname, '../..')
const decode_text = (input: BufferSource) => new TextDecoder().decode(input)

export
async function wnb(mod: I_mod) {
    /** absolute mod dir */
    const mod_dir = get_mod_dir(mod.type, mod.key)
    const src_dir = resolve_path(mod_dir, 'src')
    const compiled_dir = resolve_path(mod_dir, 'dist')
    log.app.inf(`Start watch and run: ${mod.name}
Mod   Dir: ${mod_dir}
Watch Dir: ${src_dir}`)

    exec()
    for await (const evt of Deno.watchFs(src_dir)) {
        // 目前，被 watch 的是 src，现在简单认定为“需要编译的才写在 src 里”
        log.mod.inf(`Emit: ${mod.name}
file changed: ${evt.paths}
event type: ${evt.kind}`)
        exec()
    }

    /** 执行模块任务 */
    async function exec() {
        await build() // 编译到 mod 所在的 dist
        await move_to_dist() // 移动 mod dist 到 app dist
    }
    async function build() {
        await remkdir(compiled_dir) // 删除，重新创建目录
        const cmd = make_build_cmd(mod.type, mod_dir) // 创建命令
        const output = await cmd.output() // 执行命令

        const stderr = decode_text(output.stderr) // 命令的普通日志
        const stdout = decode_text(output.stdout) // 命令的异常日志
        if (output.success)
            log.mod.suc(`WNB done (${mod.name})`)
        else
            log.mod.err(`WNB error (${mod.name}): ${output.code}`)
        if (stdout)
            log.mod.inf('STDOUT\n' + stdout)
        if (stderr)
            log.mod.err('STDERR\n' + stderr)
    }

    async function move_to_dist() {
        const mod_dist_dir = get_mod_dist_dir(mod.type, mod.key)
        await remove_dir(mod_dist_dir)
        await Deno.rename(compiled_dir, mod_dist_dir)
    }
}

function get_mod_dir(mod_type: I_mod_type, key: string) {
    const type_dir = (() => {
        switch(mod_type) {
            case 'elm-app':
                return ''
            case 'port':
                return 'port'
        }
    })()
    return resolve_path(root_workspace, type_dir, key)
}

function get_mod_dist_dir(mod_type: I_mod_type, key: string) {
    const type_dir = (() => {
        switch(mod_type) {
            case 'elm-app':
                return ''
            case 'port':
                return 'port'
        }
    })()
    return resolve_path(root_workspace, 'dist', type_dir, key)
}

function make_build_cmd(mod_type: I_mod_type, mod_dir: string) {
    switch(mod_type) {
        case 'elm-app':
            // elm make src/Main.elm --output=dist/main.js
            return new Deno.Command('elm', {
                cwd: mod_dir,
                args: [
                    'make', 'src/Main.elm',
                    '--output=dist/main.js',
                ],
            })
        case 'port':
            // deno bundle -o dist/mod.js --platform browser src/mod.ts
            return new Deno.Command('node', {
                cwd: mod_dir,
                args: ['build.js'],
            })
    }
}
