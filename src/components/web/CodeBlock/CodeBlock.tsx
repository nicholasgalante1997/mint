import React, { memo } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { synthwave84 } from 'react-syntax-highlighter/dist/cjs/styles/prism';

function CodeBlockComponent(props: any) {
  console.log({ props, component: 'CodeBlock' });
  const { children, className, node, ...rest } = props;
  const match = /language-(\w+)/.exec(className || '');
  return match ? (
    <SyntaxHighlighter
      {...rest}
      PreTag="div"
      children={String(children).replace(/\n$/, '')}
      language={match[1]}
      style={synthwave84}
    />
  ) : (
    <code {...rest} className={className}>
      {children}
    </code>
  );
}

export const CodeBlock = memo(CodeBlockComponent);
