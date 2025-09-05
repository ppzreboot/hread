import { watch } from 'fs'
import { exec } from 'child_process'
import path from 'path'
import log from './log.js'

export
function run_onchange(
    job_name,
    module_root_dir_name,
    src_dir,
    job,
) {
    src_dir = path.join(module_root_dir_name, src_dir)
    log.app.inf(`Start watch and run: ${job_name}
Works Dir: ${module_root_dir_name}
Watch Dir: ${src_dir}`)
    watch(src_dir, { recursive: true },
        (event_type, filename) => {
            log.mod.inf(`${job_name}
file changed: ${filename}
event type: ${event_type}`)
            _exec()
        },
    )
    _exec()

    function _exec() {
        log.mod.inf('[JOB CMD] ' + job)
        exec(job, { cwd: module_root_dir_name },
            (err, stdout, stderr) => {
                if (err) {
                    log.mod.err(`Job error (${job_name}):`)
                    log.mod.err(err)
                } else
                    log.mod.suc(`Job done (${job_name})`)
                if (stdout)
                    log.mod.inf('STDOUT\n' + stdout)
                if (stderr)
                    log.mod.err('STDERR\n' + stderr)
            }
        )
    }
}
