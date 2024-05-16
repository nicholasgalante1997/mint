import React from 'react';

function wrapComponent<P = any>(
  wrappers: Array<React.ComponentType<{ children: React.ReactNode }>>,
  Component: React.ComponentType<any>
): React.FC<P> {
  let WrappedComponent = (props: any) => <Component {...props} />;
  for (const Wrapper of wrappers) {
    WrappedComponent = (props) => (
      <Wrapper>
        <Component {...props} />
      </Wrapper>
    );
  }
  return (props: any) => <WrappedComponent {...props} />;
}

export { wrapComponent };
