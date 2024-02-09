import React, { memo } from 'react';
import { Body } from 'heller-2-react';
import { type BrowseNodeProps } from './types';

const BrowseNodeClassNames = {
  root: 'browse-node__root-container',
  headingAnchorTag: 'browse-node__heading-anchor-tag',
  description: 'browse-node__description',
  badge: 'browse-node__badge'
};

function BrowseNodeComponent({ description, href, title, tags }: BrowseNodeProps) {
  return (
    <div className={BrowseNodeClassNames.root}>
      <a href={href} target="_self" className={BrowseNodeClassNames.headingAnchorTag}>
        {title}
      </a>
      <Body as="p" bold className={BrowseNodeClassNames.description}>
        {description}
      </Body>
      <div>
        {tags.map((tag) => (
          <Body as="span" className={BrowseNodeClassNames.badge} role="badge">
            {tag.visible}
          </Body>
        ))}
      </div>
    </div>
  );
}

export const BrowseNode = memo(BrowseNodeComponent);
