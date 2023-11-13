import React from 'react';

import { PageIndex, PageIndexKey } from '@/pages/index';
import { render } from '@/lib';

const PAGE = process.env.REQUEST_PAGE;
let Component = PageIndex.get(PAGE as PageIndexKey);

if (!Component) {
    Component = () => <div>404</div>;
}

render({ Component, mountingElement: 'app' });