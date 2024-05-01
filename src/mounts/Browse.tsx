import React from 'react';
import { Browse } from '@/pages/Browse';
import { render, setupAnalytics } from '@/lib';

render({ Component: Browse, mountingElement: 'app' });
setupAnalytics();
