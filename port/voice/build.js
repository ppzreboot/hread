import { build } from 'esbuild'

await build({
    entryPoints: ['./src/mod.ts'],
    bundle: true,
    outfile: './dist/mod.js',
    format: 'esm',
    treeShaking: true,
    logLevel: 'debug',
})
