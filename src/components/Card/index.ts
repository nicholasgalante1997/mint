import { CardComponent } from './Card';
import { type CardProps } from './types';
import { memo } from 'react';

const Card = memo(CardComponent);
Card.displayName = 'Couch__CardComponent';

export { Card, type CardProps };
