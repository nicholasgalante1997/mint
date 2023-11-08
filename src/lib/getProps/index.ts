function getProps<T = any>() {
  const propsElement = document.getElementById('@couch-gag/mint__props-node');
  if (propsElement) {
    const dataAsString = propsElement.innerHTML;
    const data = JSON.parse(JSON.stringify(dataAsString)) as T;
    propsElement.remove();
    return data;
  }
  return null;
}

export { getProps };
