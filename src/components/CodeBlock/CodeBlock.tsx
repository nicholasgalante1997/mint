import React, { memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import classNames from 'classnames';

import { useThemeContext } from '@/contexts';

function CodeBlockComponent(props: any) {
  const { children, className, node, ...rest } = props;
  const { mode } = useThemeContext();
  const match = /language-(\w+)/.exec(className || '');
  return match ? (
    <SyntaxHighlighter
      {...rest}
      PreTag="div"
      children={String(children).replace(/\n$/, '')}
      language={match[1]}
      style={mode === 'light' ? prism : atomDark}
      showLineNumbers
    />
  ) : (
    <code {...rest} className={classNames(className, 'inline-code')}>
      {children}
    </code>
  );
}

export const CodeBlock = memo(CodeBlockComponent);
