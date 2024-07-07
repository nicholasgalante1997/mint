import fs from 'fs';
import path from 'path';

function getAppConfig() {
	try {
		return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'config', 'app.json'), { encoding: 'utf8' }));
	} catch(e) {
		console.error(e);
		return null;
	}
}

let AppConfig = getAppConfig();

if (AppConfig == null) process.exit(2);

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
