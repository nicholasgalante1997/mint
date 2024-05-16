import classNames from 'classnames';
import React, { HTMLProps, memo } from 'react';

interface ShapesRootProps extends HTMLProps<HTMLDivElement> {}

function Shapes({ className, ...rest }: ShapesRootProps) {
  return (
    <div {...rest} className={classNames(className, 'couch-mint__shapes-root')}>
      <div id="couch-mint__shapes-square" />
      <div id="couch-mint__shapes-triangle" />
      <div id="couch-mint__shapes-circle" />
    </div>
  );
}

export default memo(Shapes as React.FC<ShapesRootProps>);
