import React from 'react';

function wrapComponent<P = any>(
  Wrapper: React.ComponentType,
  Component: React.ComponentType<P>,
  options: { wrapperProps: any } = { wrapperProps: {} }
) {
  return function (props: P) {
    <Wrapper {...options.wrapperProps}>
      <Component {...(props as any)} />
    </Wrapper>;
  };
}

export { wrapComponent };
