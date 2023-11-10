import { type Meta, type StoryObj } from '@storybook/react';
import { CardComponent } from './Card';
import { type CardProps } from './types';
import React from 'react';

const meta: Meta<typeof CardComponent> = {
  component: CardComponent,
  title: 'components/complex/card',
  args: {},
  decorators: [],
  parameters: {}
};

export default meta;

type CardStory = StoryObj<typeof CardComponent>;

export const FullLarge: CardStory = {
  args: {
    type: 'full',
    size: 'lg',
    image: 'https://coincu.com/wp-content/uploads/2022/07/111.png',
    alt: 'Doodles 2',
    title: 'Doodles: A Case Study In NFTs',
    description:
      "What is Doodles? Doodles is a collection of NFT's (Non-Fungible Tokens) that has emerged as a result of the past wave of interest in NFT baedased trading, as an alternative to traditional means of trading.",
    cta: {
      href: '#',
      text: 'Read More'
    }
  },
  render: (args: CardProps) => <CardComponent {...args} />
};

export const FullSmall: CardStory = {
  args: {
    type: 'full',
    size: 'sm',
    image: 'https://coincu.com/wp-content/uploads/2022/07/111.png',
    alt: 'Doodles 2',
    title: 'Doodles: A Case Study In NFTs',
    description:
      "What is Doodles? Doodles is a collection of NFT's (Non-Fungible Tokens) that has emerged as a result of the past wave of interest in NFT baedased trading, as an alternative to traditional means of trading.",
    cta: {
      href: '#',
      text: 'Read More'
    }
  },
  render: (args: CardProps) => <CardComponent {...args} />
};

export const MiniLarge: CardStory = {
  args: {
    type: 'mini',
    size: 'lg',
    alt: 'Doodles 2',
    title: 'Doodles: A Case Study In NFTs',
    description:
      "What is Doodles? Doodles is a collection of NFT's (Non-Fungible Tokens) that has emerged as a result of the past wave of interest in NFT baedased trading, as an alternative to traditional means of trading.",
    cta: {
      href: '#',
      text: 'Read More'
    }
  },
  render: (args: CardProps) => <CardComponent {...args} />
};

export const MiniSmall: CardStory = {
  args: {
    type: 'mini',
    size: 'sm',
    alt: 'Doodles 2',
    title: 'Doodles: A Case Study In NFTs',
    description:
      "What is Doodles? Doodles is a collection of NFT's (Non-Fungible Tokens) that has emerged as a result of the past wave of interest in NFT baedased trading, as an alternative to traditional means of trading.",
    cta: {
      href: '#',
      text: 'Read More'
    }
  },
  render: (args: CardProps) => <CardComponent {...args} />
};
