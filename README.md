# mint.  

*A minimal technology blog.*  

## Package Structure

- `.storybook/` : configuration for the storybook component development playground.
- `assets/` : static image assets.
- `build/` : The distributable build artifact. The static bundle that comprises the app and is shipped to production.
- `config/app.json` : The main application configuration file.
- `data/` : All of the articles.
- `html/` : The html template used to prepare static pages during the build process and development server.
- `webpack/` : Webpack bundle configurations.
- `src/`
  - `components/` : Shared app components.
  - `contexts/` : React context providers.
  - `lib/` : Shared utilities.
  - `mounts/` : App entrypoints. What is bundled into client side JS scripts.
  - `pages/` : Page level components.
  - `styles/` : CSS and Font files.
