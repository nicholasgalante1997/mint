import React, { memo } from 'react';
import classNames from 'classnames';

import { Body } from 'heller-2-react';
import { colorBaseBlackAlpha, colorBaseGrayAlpha } from 'heller-2-lite';

import { SummaryClassNames } from './SummaryMeta';
import { SummaryProps } from './types';

function SummaryComponent({ content, className, ...rest }: SummaryProps) {
  return (
    <section className={classNames(SummaryClassNames.Container, className)} {...rest}>
      <div className={SummaryClassNames.LabelSection}>
        <Body as="label" className={SummaryClassNames.Label}>
          Author's Notes
        </Body>
      </div>
      <div className={SummaryClassNames.ContentSection}>
        <Body as="p" className={SummaryClassNames.Content}>
          {content}
        </Body>
      </div>
    </section>
  );
}

export const Summary = memo(SummaryComponent);
