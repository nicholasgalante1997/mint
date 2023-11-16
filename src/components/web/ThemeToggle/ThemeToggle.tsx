import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ShowIf } from '@/components/logical';
import { useThemeContext } from '@/contexts';
import { ThemeModeType } from '@/contexts/theme/types';
import { keyDown, titleCase } from '@/lib';

import classNames from 'classnames';

const themeOptions = ['light', 'dark', 'alt'] as const;

const ThemeToggle = memo(function ThemeToggleComponent() {
  const [showPopover, setShowPopover] = useState(false);
  const { dispatchThemeUpdate, mode } = useThemeContext();
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverOn = () => setShowPopover(true);
  const onClickOffPopover = (event: any) => {
    if (popoverRef.current && !popoverRef.current.contains(event.target)) {
      setShowPopover(false);
    }
  };

  useEffect(() => {
    if (showPopover) {
      document.body.addEventListener('click', onClickOffPopover);
    } else {
      document.body.removeEventListener('click', onClickOffPopover);
    }
    return () => document.body.removeEventListener('click', onClickOffPopover);
  }, [showPopover]);

  const mapThemeOptionsToJsx = useCallback(
    function (theme: ThemeModeType) {
      const clickHandler = () => {
        console.log('The dispatch theme update handler is being called', theme);
        dispatchThemeUpdate(theme);
      };
      return (
        <div
          key={theme}
          {...keyDown(clickHandler)}
          onClick={clickHandler}
          className="couch-mint__theme-option-container"
        >
          <span
            className={classNames({
              'couch-mint__theme-option': true,
              'couch-mint__theme-option-active': mode === theme
            })}
          >
            {titleCase(theme)}
          </span>
        </div>
      );
    },
    [mode]
  );
  return (
    <div ref={popoverRef} className="couch-mint__theme-button-container">
      <button
        onClick={popoverOn}
        onKeyDown={keyDown(popoverOn)}
        className="couch-mint__button-primary couch-mint__theme-toggle-button"
      >
        Theme
      </button>
      <ShowIf condition={showPopover}>
        <div className="couch-mint__theme-selection-popover">
          {themeOptions.map(mapThemeOptionsToJsx)}
        </div>
      </ShowIf>
    </div>
  );
});

export { ThemeToggle };
