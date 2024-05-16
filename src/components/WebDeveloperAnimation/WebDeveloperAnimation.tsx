import React, { memo } from 'react';
import Lottie from 'react-lottie';

import animation from './web-developer-working.lottie.json';
import { useScreenContext } from '@/contexts/Screen';

const baseSize = 200;
const scale = 2;
const mobileScale = 1.45;

const options = {
  loop: true,
  autoplay: true,
  animationData: animation,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

function WebDevAnimation() {
  const { screen } = useScreenContext();
  if (screen === null) return false;
  return (
    <Lottie
      options={options}
      height={screen === 'mobile' ? mobileScale * baseSize : scale * baseSize}
      width={screen === 'mobile' ? mobileScale * baseSize : scale * baseSize}
    />
  );
}

export default memo(WebDevAnimation);
