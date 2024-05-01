import React from 'react';
import { getProps, render, setupAnalytics } from '@/lib';
import { MainArticle, MainArticleProps } from '@/pages/Post';

const props = getProps<MainArticleProps>();
render({ Component: MainArticle, mountingElement: 'app', props });
setupAnalytics();
