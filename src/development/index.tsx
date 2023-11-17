import React from 'react';

import { PageIndex, PageIndexKey } from '@/pages/index';
import { render } from '@/lib';

import loremIpsum from './lorem';

const PAGE = process.env.REQUEST_PAGE;
let Component = PageIndex.get(PAGE as PageIndexKey);

if (!Component) {
  Component = () => <div>404</div>;
}

let props = {};

if (PAGE === PageIndexKey.MainArticle) {
  props = {
    public: {
      title: 'Building a static website engine with react-dom and react-markdown',
      subtitle:
        'Leveraging the react-dom/server api and react-markdown, you can build yourself a static site engine that allows you to quickly standup markup documents into full fledged interactive web pages.',
      markdown: loremIpsum,
      publishing: {
        collection: 'React',
        date: '16 Nov 2023'
      },
      image: {
        alt: 'Doodles NFT, pink backdrop',
        src: 'https://coincu.com/wp-content/uploads/2022/07/111.png'
      }
    }
  };
}

render({ Component, mountingElement: 'app', props });
