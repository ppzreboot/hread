export
async function remove_dir(dir: string) {
    if (await exist(dir))
        await Deno.remove(dir, {
            recursive: true,
        })
}

export
async function exist(path: string) {
    try {
        await Deno.stat(path)
        return true
    } catch {
        return false
    }
}

export
async function remkdir(dir: string) {
    await remove_dir(dir)
    await Deno.mkdir(dir)
}
