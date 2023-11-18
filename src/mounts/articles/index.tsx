import React from 'react';

import { MainArticle, MainArticleProps } from '@/pages/article/main';

import { getProps, render } from '@/lib';

const props = getProps<MainArticleProps>();

console.log({ props });

render({ Component: MainArticle, mountingElement: 'app', props })

