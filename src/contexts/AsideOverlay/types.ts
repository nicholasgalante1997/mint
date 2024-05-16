export interface AsideOverlayContextType {
  visibility: {
    isOpen: boolean;
  };
  open(): void;
  hide(): void;
}

export interface AsideOverlayProviderProps {
  children: React.ReactNode[] | React.ReactNode;
}
