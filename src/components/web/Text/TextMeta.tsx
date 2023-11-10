import React from 'react';
import { TextElement, TextProps } from './types';

const TextAsElementMap = new Map<TextElement, React.FC<Omit<TextProps, 'font' | 'as'>>>();

TextAsElementMap.set('h1', ({ children, ...rest }) => <h1 {...rest}>{children}</h1>);
TextAsElementMap.set('h2', ({ children, ...rest }) => <h2 {...rest}>{children}</h2>);
TextAsElementMap.set('h3', ({ children, ...rest }) => <h3 {...rest}>{children}</h3>);
TextAsElementMap.set('h4', ({ children, ...rest }) => <h4 {...rest}>{children}</h4>);
TextAsElementMap.set('h5', ({ children, ...rest }) => <h5 {...rest}>{children}</h5>);
TextAsElementMap.set('h6', ({ children, ...rest }) => <h6 {...rest}>{children}</h6>);

TextAsElementMap.set('p', ({ children, ...rest }) => <p {...rest}>{children}</p>);
TextAsElementMap.set('label', ({ children, ...rest }) => <label {...rest}>{children}</label>);
TextAsElementMap.set('span', ({ children, ...rest }) => <span {...rest}>{children}</span>);

export { TextAsElementMap };
