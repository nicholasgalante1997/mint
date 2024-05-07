import { HTMLProps } from 'react';

type SummaryProps = {
  content: string;
} & HTMLProps<HTMLDivElement>;

export { type SummaryProps };
