import React, { memo } from 'react';

type ConditionalProps = {
  children: React.ReactNode;
  condition: boolean;
};

function ConditionalComponent({ children, condition }: ConditionalProps) {
  return condition && children;
}

export const Conditional = memo(ConditionalComponent);
