import React from 'react';

export function keyDown(fn: () => void) {
  return function (e: React.KeyboardEvent) {
    if (e.key.toLowerCase() === 'enter' || e.key.toLowerCase() === 'return') {
      fn();
    }
  };
}
