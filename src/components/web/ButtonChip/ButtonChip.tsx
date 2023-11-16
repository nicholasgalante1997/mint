import React, { memo } from 'react';

import { ButtonChipProps } from './types';

function ButtonChipComponent({ children, onClick }: ButtonChipProps) {
  return (
    <span className="couch-mint__button-chip" onClick={onClick}>
      {children}
    </span>
  );
}

export const ButtonChip = memo(ButtonChipComponent);
