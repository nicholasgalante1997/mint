import React from 'react';
import { StoryObj, Meta } from '@storybook/react';
import Shapes from './Shapes';

const meta: Meta<typeof Shapes> = {
  title: 'components/shapes',
  component: Shapes,
  decorators: [],
  args: {},
  parameters: {}
};

export default meta;

type ShapesStory = StoryObj<typeof Shapes>;

export const Main: ShapesStory = {
  render: () => <Shapes />
};
