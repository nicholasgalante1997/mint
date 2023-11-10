import React from 'react';
import { getProps, render } from '@/lib';

render({ Component: () => <p>Mint</p>, mountingElement: 'app', props: getProps() });
