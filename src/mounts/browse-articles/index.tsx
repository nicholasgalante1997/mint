import React from 'react';
import { Browse } from '@/pages/article/browse/Browse';
import { render, setupAnalytics } from '@/lib';

render({ Component: Browse, mountingElement: 'app' });
setupAnalytics();
