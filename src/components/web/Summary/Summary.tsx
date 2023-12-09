import React, { memo } from 'react';
import classNames from 'classnames';
import { CouchFont, Text } from '@/components/web/Text';
import { SummaryClassNames } from './SummaryMeta';
import { SummaryProps } from './types';

function SummaryComponent({ content, className, ...rest }: SummaryProps) {
  return (
    <section className={classNames(SummaryClassNames.Container, className)} {...rest}>
      <div className={SummaryClassNames.LabelSection}>
        <Text font={CouchFont.Newake} as="label" className={SummaryClassNames.Label}>
          Article Summary
        </Text>
      </div>
      <div className={SummaryClassNames.ContentSection}>
        <Text font={CouchFont.Newake} as="p" className={SummaryClassNames.Content}>
          {content}
        </Text>
      </div>
    </section>
  );
}

export const Summary = memo(SummaryComponent);
