import React, { memo, useMemo } from 'react';
import ClassNames from 'classnames';
import { useThemeContext } from '@/contexts';
import { TextAsElementMap } from './TextMeta';
import { type TextProps } from './types';

const Text = memo(function TextComponent({ font, as, children, className, ...rest }: TextProps) {
  const { mode } = useThemeContext();
  const Component = useMemo(() => TextAsElementMap.get(as), [as]);
  if (!Component) {
    return false;
  }
  return (
    <Component data-theme={mode} className={ClassNames(font, className)} {...rest}>
      {children}
    </Component>
  );
});

export { Text };
