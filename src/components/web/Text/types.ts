import { type HTMLProps } from 'react';

enum CouchFont {
  AliensAndCows = 'couch-mint__aliens-and-cows',
  HighriseRegular = 'couch-mint__highrise-regular',
  HighriseBold = 'couch-mint__highrise-bold',
  HighriseCondensed = 'couch-mint__highrise-condensed',
  ModernSans = 'couch-mint__modern-sans',
  Newake = 'couch-mint__newake'
}

type TextElement = `h${1 | 2 | 3 | 4 | 5 | 6}` | 'p' | 'span' | 'label';

type HTMLTextProps = HTMLProps<
  HTMLParagraphElement & HTMLSpanElement & HTMLHeadingElement & HTMLLabelElement
>;

type TextProps = { font: CouchFont; as: TextElement } & HTMLTextProps;

export { TextProps, TextElement, CouchFont };
