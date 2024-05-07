import React, { useCallback } from 'react';
import { Button } from 'heller-2-react';
import { CardClassNames } from './CardMeta';
import { type CardProps } from './types';
import { to } from '@/lib';

function hasInsufficientProps(props: CardProps): boolean {
  const { image, type } = props;
  if (type === 'full' && typeof image === 'undefined') return true;
  return false;
}

export function CardComponent(props: CardProps): React.JSX.Element | React.ReactNode {
  const hide = hasInsufficientProps(props);
  const { type, title, image, alt, description, cta, size = 'lg' } = props;

  const renderImage = useCallback<() => React.ReactNode>(() => {
    if (type === 'mini') return false;
    return (
      <div
        className={CardClassNames.CardImageWrapper}
        data-couchcardtype={type}
        data-couchcardsize={size}
      >
        <img
          src={image}
          alt={alt}
          className={CardClassNames.CardImage}
          data-couchcardtype={type}
          data-couchcardsize={size}
        />
      </div>
    );
  }, [type, image, size]);

  const renderBody = useCallback<() => React.ReactNode>(() => {
    return (
      <div className={CardClassNames.CardBody} data-couchcardtype={type} data-couchcardsize={size}>
        <h1 className={CardClassNames.CardTitle} data-couchcardtype={type} data-couchcardsize={size}>
          {title}
        </h1>
        <p className={CardClassNames.CardText} data-couchcardtype={type} data-couchcardsize={size}>
          {description}
        </p>
      </div>
    );
  }, [size, type]);

  const renderActions = useCallback<() => React.ReactNode>(() => {
    if (type === 'full' && size === 'lg') {
      return (
        <div style={{ marginTop: 'auto' }}>
          <Button
            onClick={() => {
              to(cta.href);
            }}
            size="small"
            v="primary"
            hover={{ animationType: 'background-transition' }}
            data-couchcardtype={type}
            data-couchcardsize={size}
          >
            {cta.text}
          </Button>
        </div>
      );
    }
    return (
      <div style={{ marginTop: 'auto' }}>
        <a
          href={cta.href}
          className="link"
          target="_self"
          data-couchcardtype={type}
          data-couchcardsize={size}
        >
          {cta.text}
        </a>
      </div>
    );
  }, [size, type]);

  if (hide) {
    return false;
  }

  return (
    <div className={CardClassNames.CardWrapper} data-couchcardtype={type} data-couchcardsize={size}>
      {renderImage()}
      {renderBody()}
      {renderActions()}
    </div>
  );
}
