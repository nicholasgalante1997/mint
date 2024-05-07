import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import { Summary } from './Summary';

const meta: Meta<typeof Summary> = {
  title: 'components/summary',
  component: Summary,
  decorators: [],
  args: {},
  parameters: {}
};

export default meta;

type SummaryStory = StoryObj<typeof Summary>;

const text =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lectus mauris ultrices eros in cursus. Sed cras ornare arcu dui vivamus arcu felis bibendum. Amet justo donec enim diam vulputate ut pharetra. Enim lobortis scelerisque fermentum dui faucibus in ornare. Enim sit amet venenatis urna cursus. Interdum varius sit amet mattis vulputate enim nulla. Ornare arcu odio ut sem nulla pharetra diam. Nunc consequat interdum varius sit amet. Consectetur adipiscing elit ut aliquam purus sit amet. Ornare aenean euismod elementum nisi. Id cursus metus aliquam eleifend mi in. Cras sed felis eget velit aliquet sagittis.';

export const Main: SummaryStory = {
  render: () => <Summary content={text} />
};
