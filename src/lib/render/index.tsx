import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import { MintRenderOptions } from './types';

function getMountingElement(mountingElement: MintRenderOptions['mountingElement']) {
  if (typeof mountingElement === 'string') {
    return document.getElementById(mountingElement)!;
  } else {
    return mountingElement;
  }
}

function render({ Component, mountingElement, props = {} }: MintRenderOptions) {
  if (process.env.NODE_ENV === 'development') {
    createRoot(getMountingElement(mountingElement)).render(<Component {...props} />);
  } else {
    hydrateRoot(getMountingElement(mountingElement), <Component {...props} />, {
      onRecoverableError(error, errorInfo) {
        console.warn('React encountered a recoverable exception during hydration.');
        console.warn(error);
        console.warn(errorInfo);
      }
    });
  }
}

export { render };
