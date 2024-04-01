import fs from 'fs';
import path from 'path';

import AppConfig from '../config/app.json' assert { type: 'json' };

const { data: { articles } } = AppConfig;

try {
    const pathToArticlesSummaryJson = path.resolve(process.cwd(), 'src', 'store', 'data', 'articles.json');
    if (fs.existsSync(pathToArticlesSummaryJson)) {
        fs.rmSync(pathToArticlesSummaryJson, { force: true });
    }
    fs.writeFileSync(pathToArticlesSummaryJson, JSON.stringify(articles, null, 2), { encoding: 'utf-8' });;
} catch (e) {
    console.error(e);
    process.exit(1);
}