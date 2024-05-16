import React, { createContext, useContext, useState } from 'react';
import Modal from 'react-modal';

import { AsideOverlayContextType, AsideOverlayProviderProps } from './types';
import { useThemeContext } from '../theme';
import { Body, Heading } from 'heller-2-react';

const customStyles = {
  content: {
    top: '-1px',
    left: '-1px',
    bottom: '-1px',
    width: '200px',
    backgroundColor: 'var(--color-base-gray-iota)',
    transition: 'width 300ms',
    borderRadius: 'none',
    margin: '0'
  },
  overlay: {
    transition: 'all 300ms'
  }
};

/** @see https://reactcommunity.org/react-modal/accessibility/ */
Modal.setAppElement('#app');

const defaultContextObj: AsideOverlayContextType = {
  visibility: { isOpen: false },
  open() {
    this.visibility.isOpen = true;
  },
  hide() {
    this.visibility.isOpen = false;
  }
};

const AsiceOverlayContext = createContext<AsideOverlayContextType>(defaultContextObj);
export const useAsideOverlayContext = () => useContext(AsiceOverlayContext);

export function AsideOverlayProviderComponent({ children }: AsideOverlayProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const hide = () => setIsOpen(false);

  const { mode } = useThemeContext();

  return (
    <AsiceOverlayContext.Provider value={{ hide, open, visibility: { isOpen } }}>
      {children}
      <Modal
        isOpen={isOpen}
        onRequestClose={hide}
        style={{
          content: customStyles.content,
          overlay: { background: mode === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0,  0,  0, 0.6)' }
        }}
      >
        <div className="couch-mint__aside-logo-root">
          <Heading as="h1">
            Mint
            <span>.</span>
          </Heading>
          <Body as="p">A minimal technology blog.</Body>
        </div>
        <div className="couch-mint__aside-link-container">
          <a
            data-current-page={'self'}
            target="_self"
            href="/browse-articles.html"
            className="icon-link link couch-mint__ls"
          >
            Posts
          </a>
          <a
            data-current-page={'other'}
            target="_self"
            href="/profile.html"
            className="icon-link link couch-mint__ls"
          >
            About
          </a>
        </div>
      </Modal>
    </AsiceOverlayContext.Provider>
  );
}
