import React from 'react';
import { render, setupAnalytics } from '@/lib';
import { Profile } from '@/pages/Profile';

render({ Component: Profile, mountingElement: 'app' });
setupAnalytics();
