import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ThemeContextProvider } from '@/contexts';
import { Text } from './Text';
import { CouchFont } from './types';

const content = 'Dumpling and Chief are dogs, who live together and go on adventures together.';

const meta: Meta<typeof Text> = {
  title: 'components/web/base/Text',
  component: Text,
  decorators: [
    (Story) => (
      <ThemeContextProvider>
        <Story />
      </ThemeContextProvider>
    )
  ]
};

export default meta;

type TextStory = StoryObj<typeof Text>;

export const AlienAndCowText: TextStory = {
  render: () => (
    <Text as="p" font={CouchFont.AliensAndCows}>
      {content}
    </Text>
  )
};

export const HighriseRegularText: TextStory = {
  render: () => (
    <Text as="p" font={CouchFont.HighriseRegular}>
      {content}
    </Text>
  )
};

export const HighriseBoldText: TextStory = {
  render: () => (
    <Text as="p" font={CouchFont.HighriseBold}>
      {content}
    </Text>
  )
};

export const HighriseCondensedText: TextStory = {
  render: () => (
    <Text as="p" font={CouchFont.HighriseCondensed}>
      {content}
    </Text>
  )
};

export const ModernSansText: TextStory = {
  render: () => (
    <Text as="p" font={CouchFont.ModernSans}>
      {content}
    </Text>
  )
};

export const NewakeText: TextStory = {
  render: () => (
    <Text as="p" font={CouchFont.Newake}>
      {content}
    </Text>
  )
};
