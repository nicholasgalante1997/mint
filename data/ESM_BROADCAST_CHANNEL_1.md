# Lets Build: Broadcast Channel  

Hey, in this one we're gonna build a browser based lighting synchronizer. I recently got a ROG Zephyrus G14 laptop (It's holding up so far!) as I'm looking more and more to get off mac-os, and they (Zephyrus) boast this gpu driven lighting synchronizer across laptop and connected displays. It's actually kind of cool, and with more community support it would likely be even cooler. Drains the battery like a bathtub though. So we're going to build out a minimal browser based implementation of this using the Broadcast Channel API to keep multiple screens across multiple displays synchronized to the same color scheme. Likely not gonna get into leveraging the GPU to increase performance but maybe we will if the lift isn't huge.  

We're gonna do this implementation in **ESM** without any specific framework backing it. Until React 19 comes out, we're likely gonna bash through a number of spikes in vanilla js, unless they directly reference using react. I know some loud voices lately (Rails looking at you) have been pretty adamant that modern HTML, ESM, and CSS are the way to go over the increasing complexity of build tools and modern frameworks. I mean I don't wanna get into a religious diatribe here in a spike article, so I'll likely revisit this theme in a later less technical essay. But we're gonna try out modern framework-less web development in this one.  

## Broadcast Channel API

So Broadcast Channel API is essentially a same-origin, cross-tab/browser/frame event driven object that you can leverage within your application to dispatch and respond to events across running instances of your app. MDN depicts it as the following, which is in my opinion better than my explanation:

> The Broadcast Channel API allows basic communication between browsing contexts (that is, windows, tabs, frames, or iframes) and workers on the same origin.

## Breakdown Of Work

Alright so let's scope our work a little bit. This is primarily concerned with narrowing down what our project is going to do. We're only interested in a small subset of Armoury Crate's features, really just the Asus Wallpaper, which is a cool high contrast lighting sequence. So our app will have access to *color palettes* and allow our user to *select a palette* which will accordingly update the color cycle across all subscribed displays. To avoid having to go and find a number of color schemes arbitrarily, we'll be using the poke-api and get-svg-colors to generate our color palettes programmatically. Our app will also be responsible for syncing new displays to an existing selected color cycle. Since we're building a browser app, we'll use the **BroadcastChannel API** to accomplish synchronization.  

We'll prime the work here by giving a short overview of what steps we're going to take to accomplish the above.

1. We'll set up a javascript project with pnpm (or your package manager of choice).
2. We'll write a few simple node scripts that rake data from the poke-api, and we'll use the get-svg-colors npm package, to derive color palettes for each pokemon, supplying us with our prebaked color palettes that we can offer to the user. We're going to write this data to a local folder `db/` which will serve as a simple JSON data source for our application to pull from.
3. We'll set up our client code index.html file and base styles.
4. We'll fetch our data from our `db/` folder and pipe it to a global store
5. We'll write some logic to handle updating the UI with new colors over a set interval.
6. We'll set up a default state for our UI
7. We'll write some markup for the Controller section of the UI.
8. We'll render our data as Pokemon options in the DOM
9. We'll attach some event listeners to each option card.

## Work

### Setup Project

You can run any of the following commands to initialize your project depending on your preference of package manager. I'll be using pnpm.

```bash
pnpm init # Creates a new node project with pnpm

npm init -y # Creates a new node project with npm

yarn init # Creates a new node project wiht yarn

```

Alternatively, if you'd like to follow along without having to code it yourself, [you can clone the code from github.](https://github.com/nicholasgalante1997/MINT--BROADCAST-CHANNEL)

Next, let's update the package.json with our project dependencies. I've pasted my final package below to allow you to copy paste.

```json

{
  "name": "<whatever-you-want>",
  "version": "1.0.0",
  "files": [
    "public/js",
    "server"
  ],
  "type": "module",
  "scripts": {
    "build": "run-s clean:* make:* copy:*",
    "copy:app": "cp -R public/* dist/",
    "copy:db": "cp -R db/*.json dist/db/",
    "clean:dist": "rm -rf dist",
    "db:write": "node server/write-db.js",
    "db:write-colors": "node server/write-color-db.js",
    "make:dist": "mkdir -p dist dist/db;",
    "rake:svgs": "node server/pull-images.js",
    "start": "npx serve dist",
  },
  "keywords": ["lighting", "colors", "theme", "synchronizer", "pokemon"],
  "license": "ISC",
  "dependencies": {
    "axios": "^1.6.8",
    "chalk": "^5.3.0",
    "color-scales": "^3.0.2",
    "express": "^4.18.3",
    "get-image-colors": "^4.0.1",
    "get-svg-colors": "^2.0.1",
    "lodash": "^4.17.21",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "npm-run-all": "^4.1.5",
    "prettier": "^3.2.5"
  },
  "packageManager": "pnpm@8.15.2", // You won't need this if you are not using pnpm
  "engines": {
    "node": "20.x"
  }
}

```

Once you've set up your package.json, you can install your local dependencies with your preferred package manager.

Next, we can set up the foundation for our package folder structure. We'll have a structure that resembles the following:

```txt

-- db/
|  |_ pokedex.json
|  |_ colors.json
| 
-- public/
|  |_ assets/
|  |  |_ fonts/
|  |  |_ icons/
|  |  |_ images/
|  |  |_ svgs/
|  |utils
|  |_ js/
|
-- server/
|
-- package.json

```

We can accomplish the following setup by running:

```bash

mkdir -p db \
  public \
  public/js \
  public/js/clients \
  public/js/config \
  public/js/events \
  public/js/lib \
  public/js/store \
  public/assets \
  public/assets/fonts \
  public/assets/icons \
  public/assets/images \
  public/assets/svgs \
  server \
  server/lib \
  server/clients

```

### Node Scripts

#### Node Scripts, Preface > Let's Build Out Some Facilitators for Common JS Pattterns

So before we dive into writing our scripts

---

Okay so we are going to populate our `server/` directory now with several scripts that are going to facilitate fetching some pokemon data, parsing it to fit our needs, and writing the results out to several local json files.

Let's start with creating a file called `write-db.js` which can go in the root of our `server` directory.

This script is going to be responsible for fetching JSON data from the PokeAPI, scrubbing some of the larger non-necessary fields, and then writing the resultant data to a db.json file.

## Post Mortem

Okay, I'll be honest, this one turned into a way larger undertaking than imagined, but it was also way more fun than expected. The BroadcastChannel implementation and learnings really only ended up being a small part of this project.