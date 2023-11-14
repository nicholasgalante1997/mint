import React, { memo } from 'react';

type ShowIfProps = {
  children: React.ReactNode;
  condition: boolean;
};

function ShowIfComponent({ children, condition }: ShowIfProps) {
  return condition ? children : false;
}

export const ShowIf = memo(ShowIfComponent);
