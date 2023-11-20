import React from 'react';
import { render, setupAnalytics } from '@/lib';
import { Home } from '@/pages/home';

render({ Component: Home, mountingElement: 'app' });
setupAnalytics();
