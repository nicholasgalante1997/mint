import React from 'react';
import { render, setupAnalytics } from '@/lib';
import { Home } from '@/pages/Home';

render({ Component: Home, mountingElement: 'app' });
setupAnalytics();
