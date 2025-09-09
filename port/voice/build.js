import { build } from 'esbuild'

build({
    entryPoints: ['src/mod.ts'],
    outfile: 'dist/mod.js',
    bundle: true,
    logLevel: 'debug',
    format: 'esm',
    treeShaking: true,
    // minify: true,
})
