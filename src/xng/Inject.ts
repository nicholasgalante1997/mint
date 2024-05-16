import { MARKERS } from './Markers';

export function inject(template: string, markup: string, bundle: string, props?: any) {
  return template
    .replace(MARKERS.SCRIPT, createModuleScript(bundle))
    .replace(MARKERS.APP, markup)
    .replace(MARKERS.DYNAMIC_PROPS, createJSONScript(props));
}

function createModuleScript(bundleName: string) {
  return `<script src="${bundleName}.bundle.js" defer></script>`;
}

function createJSONScript(props: any) {
  if (props === null || typeof props === 'undefined') return '';
  return `<script id="@couch-gag/mint__props-node" type="application/json">${JSON.stringify(
    props
  )}</script>`;
}
