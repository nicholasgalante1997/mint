import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { ThemeContextProvider } from '@/contexts';

import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'components/web/Header',
  component: Header,
  decorators: [
    (Story) => (
      <ThemeContextProvider>
        <Story />
      </ThemeContextProvider>
    )
  ]
};

export default meta;

type HeaderStory = StoryObj<typeof Header>;

export const Main: HeaderStory = {
  render: () => <Header />
};
