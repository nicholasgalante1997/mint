# Lets Build: Broadcast Channel  

Hey, in this one we're gonna build a browser based lighting system synchronizer. I recently got a ROG Zephyrus G14 laptop (It's holding up so far!) as I'm looking more and more to get off macos, and they (Zephyrus) boast this gpu driven lighting synchronizer across laptop and connected displays. It's actually kind of cool, and with more community support it would likely be even cooler. Drains the battery like a bathtub though. So we're going to build out a browser based implementation of this using the Broadcast Channel API to keep multiple screens across multiple displays synchonized to the same color scheme. Likely not gonna get into leveraging the GPU to increase performance but maybe we will if the lift isn't huge.  

We're gonna do this implementation in esm without any specific framework backing it. Until React 19 comes out, we're likely gonna bash through most non React Specific "Lets Builds" in vanilla js. I know some loud voices lately (Rails looking at you) have been pretty adamant that modern html, esm, and css are the right way to go over the increasing complexity of build tools and modern frameworks. I mean I don't wanna get into a religious diatribe here in a "Lets Build" so I'll likely revisit this theme in a later less technical essay. But we're gonna try out modern framework-less web development in this one. Boot your straps up.  

## Broadcast Channel API

So Broadcast Channel API is essentially a same-origin, cross-tab/browser/frame event bus that you can leverage within your application to dispatch and respond to events across running instances of your app. MDN depicts it as the following, which is in my opinion better than my explanation:

> The Broadcast Channel API allows basic communication between browsing contexts (that is, windows, tabs, frames, or iframes) and workers on the same origin.

## Breakdown Of Work

Alright so let's scope our work a little bit. This is primarily concerned with narrowing down what our project is going to do. We're only interested in a small subset of Armoury Crate's features, really just the Asus Wallpaper, which is a cool high contrast lighting sequence. So our app will have access to *color palettes* and allow our user to *select a palette* which will accordingly update the color cycle across all subscribed displays. It will also be responsible for syncing new displays to an existing selected color cycle. Since we're building a browser app, we'll use the **BroadcastChannel API** to accomplish synchronization.  

## Work  

### Step One: Tech Stack, Package Structure

Well we promised early on that we'd do this sans frameworks, so we'll be using plain old html, css, and ecmascript modules. We'll leverage [import maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap#syntax) for our external dependencies that need to be run in the browser so we don't need to pollute the devx by needing a bundler/build-config. To that extent, we won't be using typescript (get over it) or react (stay over it).  



## Post Mortem

Okay, I'll be honest, this one turned into a way larger undertaking than imagined, but it was also way more fun than expected. The BroadcastChannel implementation and learnings really only ended up being a small part of this project.