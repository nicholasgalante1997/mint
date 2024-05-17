# REACT CONF 2024 - React Compiler: Migrate A Custom SSG React App to use React Compiler

React Conf 2024 has come and gone. But damn, it was a good one. React RSC. Server Actions. Form actions. New hooks. The use API. And to top it off, React Compiler.  

Well, it's been literally one day, and I can't stop thinking about React Compiler. So here's what we're gonna do. We're going to migrate a small to medium size production grade Vanilla React Custom SSG Application to use React Compiler. That's right. Framework-less static site generation of React Pages using React Compiler on the client AND server. Who's ready? I cannot wait.  

![swe-blog](/react/swe.png)

I have a developer blog that I've stood up on Vercel. You can also find this article there. That blog app is now powered in production by React Compiler. If you're reading this article on swe-blog.vercel.app, you are literally reading about the migration of the app, on the app. Pretty meta.  

Here's the breakdown of how this is going to go:  

> A Brief Overview of React Compiler
> 10,000 Foot Overview of SWE Blog
> Migration Updates
> Verifying React Compiler Setup

## Brief Overview of React Compiler

**What is React Compiler?**  

React Compiler is a new experimental compiler that we've open sourced to get early feedback from the community. It is a build-time only tool that automatically optimizes your React app. It works with plain JavaScript, and understands the Rules of React, so you don't need to rewrite any code to use it.  

That's right from the React team. So what is React Compiler going to do for you? It's going to allow us to deprecate the usage of manual memoization calls with useMemo, because now React Compiler will attempt to automate the optimization of Function Components and hooks. Been meaning to memoize and never got around to it? No worries, React Compiler's going to now do it for you, to the best of it's ability.  

I would also highly recommend watching the below video, which is the React Conf 2024 React Compiler Case Studies Talk: Forget About Memo. In the video, Lauren Tan walks us through using the react compiler in the decentralized social media application, Bluesky, which is built with React and Expo.  

<iframe width="560" height="315" src="https://www.youtube.com/embed/T8TZQ6k4SLE?si=AwrtrmChNxgRtgbo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 10,000 Foot Overview of SWE-Blog

So in a nutshell, this is your run of the mill blog application. It's a React application that has a splash page, a directory, some quasi-dynamic article pages, and to stroke my own vanity, a profile page. It's statically prepared. No need for any per-request generation. It could have used Next.js or Remix or Gatsby (remember Gatsby?). It doesn't though. It's an entirely framework-less approach to static site generation with React.  

There are certainly a number of benefits to using React Frameworks, and it seems more and more that the React team is suggesting that production grade applications should be using frameworks to get first access to new React features and concepts. So you know, consider using frameworks if you're doing something more enterprise grade.  

Let's move into a tweet sized description of our app's architecture and routing.  

There's an app wide JSON config, which defines our client entry-points and some metadata that we'll use to render our Pages on the server when we write them out to static markup. We default to using a native browser/native html routing architecture, so a combination of using window.location for non-nav elements and using anchor tags where applicable, along with a web worker pattern for prefetching assets when their navigable elements are brought into view.  

We can likely now deprecate the web worker pattern in place for React DOM's new native preloading functions which is rad. React 19 also has metadata and style tag hoisting from nested components. So we have multiple First Class React Citizens to confine asset loading and asset preloading to more sensible places in our React tree.  

When we build the swe-blog app, we automatically update some Article Metadata used in context with the latest updates from App Config, then we build our client javascript bundles based on client entry-points defined in AppConfig.  

Then we transpile and run our static site generation script, which will iterate through defined pages in our AppConfig, retrieve any static props the page needs, and render each Page to markup on the server. Then we inject the React markup in a larger predefined html template, and inject the name of the bundled javascript that corresponds to the page into the html as well, along with any props it needs client side as a application/json script. 
The client side render function will retrieve any props stashed in the document before React hydrates the page and pass them off to the page component, and then remove the json script element from the DOM. We write out the injected markup to our build directory. Then we minimize and copy any assets we need over to our build dir. Then we ship.  

## Migration Updates

So with that brief overview, let's pinpoint what we did to migrate over to using React Compiler, how we determined what to do, and how we verified it worked.  

Foremost, I followed this guide for the majority of this migration.  

First, make sure you upgrade your react dependency before you do this. You can run the following command to update your React version to the latest version of React 19 beta. The React 19 beta package has been updated quite a bit in the last few weeks, so if you migrated to React 19 beta previously there's a good shot your version is stale already. You can play it safe by just running the below command.  

```bash
pnpm install react@beta react-dom@beta 
```

Your package JSON should now also have the following modifications made to it:

```json
{
  "dependencies": {
    "@types/react": "npm:types-react@beta",
    "@types/react-dom": "npm:types-react-dom@beta"
  },
  "overrides": {
    "@types/react": "npm:types-react@beta",
    "@types/react-dom": "npm:types-react-dom@beta"
  }
}
```

So to get a feel for our app's compatibility with React Compiler, we can run the following health check, which is the first thing I did and recommend you doing.  

```bash
npx react-compiler-healthcheck
```

Which will spit out a little summary about it's analysis of your app. Here's what the command output for swe-blog.

```bash
$ npx react-compiler-healthcheck

> Successfully compiled 18 out of 23 components.
> StrictMode usage not found.
> Found no usage of incompatible libraries.

```

Cool. So by all means barrel ahead. That's what I'm reading. Next, according to the Compiler adoption guide, we want to set up linting rules that support using React Compiler. We can install the eslint plugin witht he following command:  

```bash
pnpm install eslint-plugin-react-compiler
```

And we can update our eslint config as follows, along with maintaining your other linting rules.  

```js
plugins: [
    'eslint-plugin-react-compiler',
],
rules: {
    'react-compiler/react-compiler': "error",
},
```

This app uses babel and webpack5 for transpilation and bundling respectively. So we're gonna go ahead and try and do this (add React Compiler) with a custom babel loader.  

We have some common browser webpack config which is used in our webpack dev server when we run dev, and our production webpack compilation when we run build. And then we have some server side specific webpack configuration to transpile our ssg script that renders our App on the server from TS to JS to execute it. So we'll need to update our babel configuration in one place where both our browser webpack common config and our node webapck config can share access to it, since both are transpiling React code, we'll want React Compiler on both the client and server.  

First, I created a module for the ReactCompilerBabelConfig so that we could house react compiler config in it's own standalone file.

**babel-react-compiler.config.cjs**  

```js
module.exports = {
 sources: (filename) => {
   return filename.includes('src');;
 }
}
```

With this configuration, we're stating that we only want React Compiler to transpile files that are from the src directory. Which is most of our react app to be honest. We're going all in.  

**babel-react-compiler.loader.cjs**  

```js
const { transformSync } = require('@babel/core');
const BabelPluginReactCompiler = require('babel-plugin-react-compiler');
const BabelPresetEnv = require('@babel/preset-env');
const BabelPresetReact = require('@babel/preset-react');
const BabelPresetTs = require('@babel/preset-typescript');
const reactCompilerConfig = require('./babel-react-compiler.config.cjs');

function reactCompilerLoader(sourceCode, sourceMap) {
  const result = transformSync(sourceCode, {
    filename: this.resourcePath, // Absolute path to file
    presets: [BabelPresetEnv, BabelPresetReact, BabelPresetTs],
    plugins: [
      [BabelPluginReactCompiler, reactCompilerConfig],
    ],
  });

  if (result === null) {
    this.callback(
      Error(
        `Failed to transform "${this.resourcePath}"`
      )
    );
    return;
  }

  this.callback(
    null,
    result.code,
    result.map === null ? undefined : result.map
  );
}

module.exports = reactCompilerLoader;
```

If you want a more in-depth understanding of what's going on here, it would be helpful to review writing a loader and the babel transformSync function. But basically what's going on here is we're transforming our source code with babel core transformSync and we're configuring babel to transpile our code with the typescript, react, and env presets, and the babelReactCompiler plugin, which is itself configured with our babel-react-compiler config.cjs default export.  

So now we can update our webpack configuration files as follows:

**browser.webpack.common.cjs**  

```js
const dotenv = require('dotenv');
const path = require('path');
const webpack = require('webpack');

// ...

module.exports = {
  target: ['web', 'es2022'],
  module: {
    rules: [
      {
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false
        }
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: path.resolve(process.cwd(), 'webpack', 'babel-react-compiler.loader.cjs'),
        }
      },
      // Rest of rules...
    ]
  },
// Rest of configuration...
};
```

**webpack.node.cjs**  

```js
const path = require('path');
const webpack = require('webpack');

// ...

module.exports = {
  mode: 'production',
  entry: path.resolve(process.cwd(), 'src', 'xng', 'index.ts'),
  output: {
    path: path.resolve(process.cwd(), '.xng'),
    filename: 'main.cjs'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: path.resolve(process.cwd(), 'webpack', 'babel-react-compiler.loader.cjs'),
        }
      }
    ]
  },
  target: 'node',
  node: {
    global: false
  },
  // ...Rest of config
};
```

**Issues you might hit**  

`[variable].useMemoCache is not a function`

Update your React 19 beta dependency. Broh.

`Module not found: Error: Default condition should be last one.`

Check out this stack overflow article. It's likely that one of your dependencies is incorrectly using the package.json exports field to make their modules available. If it's a package your team owns, awesome. Make the above suggested tweak, and correct your dependency package's package.json exports field. If it's not a package your team owns, get over to that package's github and open an issue.  

## Verifying React Compiler Setup

Cool. This is the fun part. Let's verify that we have React Compiler integrated and working as expected.  

![swe-blog](/react/no-compiler.png)

Here's our swe-blog app on its main branch. This branch doesn't have React Compiler integrated. We're going to inspect our React DevTools and check out our component tree.
As you can see, no magic sparkle! ✨ ✨✨✨✨!  

We're gonna need that sparkle. So now, let's switch over to our React 19 migration branch, where we've set up React Compiler.  

![swe-blog](/react/compiler.png)

Look at that. Would you just look at it? It's beautiful. All that obsolete manual memoization. All that automated memoization that React Compiler enables.  

Let's dive a little deeper. I see quite a few components that weren't memoized that likely could have been. Namely: Lottie, HlrBody, Uil*, HlrHeading, Modal. Is this an issue with the beta? Nope. What's the common denominator between these components: They're all provided by dependent node_modules. Well if we go back to our webpack loader, we can see that we've explicitly told our custom loader to skip over files in node_modules so our React Compiler doesn't ever touch modules that we receive from dependencies, and for good reason. We expect our deps to ship ready to use, so we don't want to be transpiling that code. We need to either wait for our dependencies to update to using React Compiler on their own, or in my case since I maintain the hlr ui lib that this package uses, I can just go in and update that package to use React Compiler myself. Which I'll definitely do when esbuild comes out with a react-compiler plugin. Or maybe I'll move that UI lib over to using Vite, which already has a react compiler plugin.  

I hope you learned something today, and I hope you found this helpful in getting started using React Compiler.  
