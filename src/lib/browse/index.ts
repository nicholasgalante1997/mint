export function buildLocalHrefFromArticleFilePath(key: string) {
  const [dataSrcFolder, ...rest] = key.split('/');
  const pathWithoutFileEnding = rest.join('-').replace(/.md/, '.html');
  return '/' + pathWithoutFileEnding;
}
