import { useThemeContext } from '@/contexts';
import React, { memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark, prism, } from 'react-syntax-highlighter/dist/cjs/styles/prism';

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
      wrapLongLines
    />
  ) : (
    <code {...rest} className={className}>
      {children}
    </code>
  );
}

export const CodeBlock = memo(CodeBlockComponent);
