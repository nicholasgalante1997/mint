import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import postcss from "postcss";
import cssnano from "cssnano";
import autoprefixer from 'autoprefixer';
import { glob } from "glob";
import { Option, Log } from 'sleepydogs';

const logger = Log.factory({
    service: 'xng-mint-css-minifier',
    version: '1.0.0',
    level: 'info'
});

async function getCss() {
    const paths = "src/styles/*.css";
    const callback = async () => await glob(paths, { ignore: 'node_modules'});
    const $op = new Option(callback);
    const { data, error } = await $op.resolve();

    if (data === null || error) {
        logger.error('Failed to load css files from src/styles');
        logger.error(error);
        process.exit(1);
    }

    return data;
}

async function writeMinifiedCssFile(file, index) {
    const filepath = path.resolve(process.cwd(), file);
    const outfile = path.resolve(process.cwd(), 'build', 'web', 'index.css');
    const css = await readFile(filepath, { encoding: 'utf8' });
    const minCss = await minifyCss(css, filepath, outfile);
    await writeFile(outfile, minCss, { encoding: 'utf8' });
}

async function minifyCss(css, source, out) {
    return await postcss([autoprefixer, cssnano])
        .process(css, { from: source, to: out })
        .then(({ css: minCss }) => minCss)
}

async function run() {
    const files = await getCss();
    files.forEach(writeMinifiedCssFile);
}

await run();
