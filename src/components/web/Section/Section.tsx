import React, { memo } from 'react';
import { Heading } from 'heller-2-react';
import { SectionProps } from './types';

function SectionComponent(props: SectionProps) {
  return (
    <section
      className="couch-mint__section-root-container couch-mint__highrise-bold"
      style={{ letterSpacing: '0.04em' }}
    >
      <Heading as="h1">{props.label}</Heading>
      <div className="couch-mint__section-child-container">{props.children}</div>
    </section>
  );
}

export const Section = memo(SectionComponent);
