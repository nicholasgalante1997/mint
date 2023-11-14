import React, { memo, useCallback, useState } from 'react';
import { ShowIf } from '@/components/logical';
import { useThemeContext } from '@/contexts';
import { ThemeModeType } from '@/contexts/theme/types';
import { keyDown, titleCase } from '@/lib';

import { AltIcon } from './AltIcon';
import { DarkIcon } from './DarkIcon';
import { LightIcon } from './LightIcon';

const themeOptionIconMap = {
  light: LightIcon,
  dark: DarkIcon,
  alt: AltIcon
};

const themeOptions = ['light', 'dark', 'alt'] as const;

const ThemeToggle = memo(function ThemeToggleComponent() {
  const [showPopover, setShowPopover] = useState(false);
  const { dispatchThemeUpdate, mode } = useThemeContext();

  const mapThemeOptionsToJsx = useCallback(function (theme: ThemeModeType) {
    const clickHandler = () => dispatchThemeUpdate(theme);
    const Icon = themeOptionIconMap[theme];
    return (
      <div {...keyDown(clickHandler)} onClick={clickHandler} className="couch-mint__theme-option-container">
        <Icon />
        <span className="couch-mint__theme-option">
          {titleCase(theme)}
        </span>
      </div>
    );
  }, []);
  return (
    <div className="couch-mint__theme-button-container">
      <button className="couch-mint__button-primary">Theme</button>
      <ShowIf condition={showPopover}>
        <div className="couch-mint__theme-selection-popover">
          {themeOptions.map(mapThemeOptionsToJsx)}
        </div>
      </ShowIf>
    </div>
  );
});

export { ThemeToggle };
