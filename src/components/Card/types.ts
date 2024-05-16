export interface CardProps {
  type: 'full' | 'mini';
  title: string;
  description: string;
  cta: {
    href: string;
    text: string;
  };
  image?: string;
  alt?: string;
  size?: 'lg' | 'sm';
}
