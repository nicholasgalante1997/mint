import React, { memo } from 'react';
import { RoughNotation } from 'react-rough-notation';

import { NotationProps } from './types';

function NotationComponent({ color, children, length }: NotationProps) {
  return (
    <RoughNotation
      type="highlight"
      multiline={true}
      iterations={1}
      animationDuration={Math.floor(30 * length)} // Change the animation duration depending on length of text we're animating (speed = distance / time)
      color={color}
    >
      {children}
    </RoughNotation>
  );
}

export const Notation = memo(NotationComponent);
