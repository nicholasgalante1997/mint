function getProps<T = any>() {
  const propsElement = document.getElementById('@couch-gag/mint__props-node');
  if (propsElement) {
    const dataAsString = propsElement.textContent;
    if (!dataAsString) {
      return null;
    }
    const data = JSON.parse(dataAsString) as T;
    propsElement.remove();
    return data;
  }
  return null;
}

export { getProps };
