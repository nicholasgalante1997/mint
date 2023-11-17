type MainArticleProps = {
  public: {
    title: string;
    subtitle: string;
    image: {
      src: string;
      alt: string;
    };
    publishing: {
      date: string;
      collection: string;
    };
    markdown: string;
  };
};

export { type MainArticleProps };
