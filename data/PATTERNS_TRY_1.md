# Brevity

This article is going to be short, perhaps even a little opinionated (the worst). In every programming language, you encounter certain scenarios that require that you handle code that might fail. Maybe you try to open a file that doesn't exist or that you don't have permission to open. Maybe a network request goes down due to a server being offline. This article primarily offers opinions on scalable patterns to reduce boilerplate code in such scenarios, and to increase robustness and performance in certain scenarios.

If you're looking to develop a better foundation with regards to Error Handling in javascript, I'd recommend reading [Triton's Error Handling in Node Js](https://www.tritondatacenter.com/node-js/production/design/errors), which this post may refer to from time to time. Here's an excerpt from the post that I think will offer a decent starting point to this discussion on error handling:

> The general rule is that a function may deliver operational errors synchronously (e.g., by throwing [or returning the error]) or asynchronously (by passing them to a callback or emitting error on an EventEmitter), but it should not do both. This way, a user can handle errors by either handling them in the callback or using try/catch, but they never need to do both. Which one they use depends on what how the function delivers its errors, and that should be specified with its documentation.

This does a concise job of enumerating the options we have when dealing with potentially fallible code, and illustrating a core concept in exception handling - out of the several options that we have for handling exceptions, a particular function should only ever handle an exception in a single way. It should throw an error, OR pass the error to a callback OR emit theme on an EventEmitter, etc., but it shouldn't do more than one of the above  for a given function implementation.  

We can think of the phrase *operational error*, as being akin to "run-time problems experienced by correctly-written programs". With that in mind, let's move on to explore more concrete implementations and patterns.  

## Code Smells With Common Exception Handling Strategies

Okay so to illustrate some of what I'm hoping to break into, we're going to write a simple node program that is going to attempt to load a file in the local file system based off of a command line arg that it's passed, and then it's going to cherry pick every prime line in the poem and write a new poem based off those lines. Pretty straightforward and useless, so a great place to start.

We're going to start by implementing this example using try/catch/throw, and then we'll dig into what code smells we have in this implementation.

Okay so we'll start by setting up this placeholder async `run` function that we'll invoke to run the program, and we'll fill it in as we go.

**prime-poem.try-catch-throw.js**:

```js
#! /usr/bin/env node

async function run() {
    try {
        // our implementation
    } catch(e) {
        console.error(e);
    }
}

await run();
```

Second, we'll need to parse a command line argument, and if we don't receive a command line argument for the file we're looking to load, we'll throw an error and short circuit the operation since we can't really continue without a supplied filename.

```js
#! /usr/bin/env node

async function run() {
    try {
        const fileArg = getFileArg();
    } catch(e) {
        console.error(e);
    }
}

function getFileArg() {
    const args = process.argv.slice(2);
    if (args.length < 1) throw new Error("MISSING FILENAME ARGUMENT")
    return args[0];
}

await run();
```

Okay great, pretty easy there; return the filename argument, or throw an error that we're missing the filename argument.

So now we'll need to load the file that we've been passed as an argument. We'll make an assumption here that all the poems in the entire fs live in a co-located folder called `poems`. So here's our updated `run` function.

```js
...

import { readFile } from 'node:fs/promises';

async function run() {
    try {
        const fileArg = getFileArg();
        const file = await readFile(`./poems/${filepath}`, { encoding: "utf8" });
    } catch(e) {
        console.error(e);
    }
}

...
```

Once we have our loaded poem file, we would like to iterate over the poem and cherry pick the prime numbered lines from the poem. This is also pretty straightforward. We can write a simple utility function here that accepts a string, and splits the string on newline characters, and filters for prime line indexes. A simple implementation that's unoptimized might resemble the following:

```js
function takeEveryPrimeLine(poem) {
    return poem.filter((_, i) => isPrimeNum(i));
}

function isPrimeNum(num) {
    if (num < 2) return false;
    const sqrt = Math.sqrt(num);
    for (let x = 2; x <= sqrt; x++) {
        if ((num % x) === 0) return false;
    }
    return true;
}
```

And we can now update our run function to be the following:

```js
async function run() {
    try {
        const filepath = getFileArg();
        const file = await readFile(`./poems/${filepath}`, { encoding: "utf8" });
        const lines = file.split("\n");
        const primeLines = takeEveryPrimeLine(lines);
    } catch(e) {
        console.error(e);
    }
}
```

## OOP

### Functional Programming (I Still Like Ike)

---
[Excised]

Section: Differentiating on Function Type

Whereas the above post from Triton makes an important distinction on which exception handling approach to take based on whether the function is synchronous or asynchronous, this post will deviate slightly and instead will leverage throw/try/catch for both synchronous and asynchronous operations that return a value, and will leverage callbacks for void functions that are pure side effects, and I'll offer context as to why.

Functional code that returns a value is often blocking in regards to the execution environment calling it. Either the value returned from the function is needed for some later computation in the body of the function, or the value is itself propagated out of the function by being returned to the calling scope. With the advent of async/await syntax, it's become a commonly adopted pattern to pause execution of synchronous code that's dependent on an asynchronously provided value by `await` -ing for the promise that provides that async value to resolve.  

Void functions are typically mutative in nature, perhaps mutative of the internal data model or the DOM, but typically we can avoid halting execution context on the operation, and instead pass a callback that handles edge cases in which our void function fails to complete it's intended task.

---

[Excised]

Let's move into discussing code smells with try/catch/throw. 

> Expand the above examples to illustrate issues with try/catch/throw ->

Here's a simple example illustrating an asynchronous function that pauses further execution of synchronous code until it resolves a promise and has a value, and an example of an asynchronous void function that writes/mutates a file in the local directory. If anything fails in either function, they clean up any mutations and re-throw the error. For all intents and purposes these are supposed to be simple examples, so algorithmic optimization is ignored here.

```js
import { readFile, appendFile, rm } from 'node:fs/promises';

/**
 * This is a simple function that loads a file `poem.txt`
 * and iterates through each line,
 * searching for a matching phrase.
 * 
 * When it finds a match, it adds it to the array to be returned.
 * 
 * Can be configured to match case-sensitive or insensitive.  
 * Case Sensitive is the default.
 * 
 * @param {string} a 
 * @param {boolean} i - Case insensitive
 * @returns {Promise<string[]>}
 */
async function searchForPhraseInPoem(a, i = false) {
    try {
        const poem = await readFile('poems.txt', { encoding: 'utf-8' });
        return poem.split(`\n`)
            .map(line => i ? line.toLowerCase() : line)
            .filter(line => line.includes(i ? a.toLowerCase() : a));
    } catch(err) {
        console.error(err);
        throw err;
    }
}

/**
 * This is a simple function that accepts an array
 * of strings and appends each element in the array
 * as a newline to the 'new-poem.txt' file.
 * 
 * If appending a line fails, the file can be considered corrupt
 * so we try to delete the file (clean up).
 * 
 * @param {string[]} lines 
 * @returns {Promise<void>}
 */
async function writePoem(lines) {
    try {
        while (lines.length) {
            await appendFile('new-poem.txt', lines.shift() + `\n`, { encoding: 'utf-8' });
        }
    } catch(err) {
        console.error(err);
        
        try {
            await rm('new-poem.txt', { force: true });
        } catch(err2) {
            console.error(err2);
            throw err2;
        }

        throw err;
    }
}


```

Okay so even in a simple program like the one illustrated above, we can see several issues with the structure and format of these try-catch implementations. Let's start with the function `searchForPhraseInPoem`.

There isn't a lot going on in `searchForPhraseInPoem`, but we do have one obvious code smell. We are wrapping code that we don't expect to fail inside the try catch block with code we think could fail. We're doing this because we need access to the variable `poem` which is declared and only available within the try block scope. That muddies up the readabilty of this code a little bit, and in an exacerbated example we could have quite a bit of code exist inside that try block if more code needed access to the variable `poem`. If we needed to perform more operations on `poem` and those operations had the potential to throw, then our catch block would need to grow in complexity to accommodate the various exceptions that may surface from the operations in our try block.

Okay so the alternative is we could rewrite `searchForPhraseInPoem` in another manner that addresses the above code smells:

```js
async function searchForPhraseInPoem(a, i = false) {
    let poem = null;
    
    try {
        poem = await readFile('poems.txt', { encoding: 'utf-8' });
    } catch(err) {
        console.error(err);
        throw err;
    }

    if (poem !== null) {
        return poem.split(`\n`)
            .map(line => i ? line.toLowerCase() : line)
            .filter(line => line.includes(a));
    } else {
        return [];
    }
}
```

Okay so we lifted up the scope of the variable `poem` by a block so that it's accessible outside the try block and now the try block only contains the code that may or may not fail, which is better and a lot more explicit about what the intention of the try block is, but we've added a ton of boilerplate code to achieve it; and now we need to perform a non-nullish check to ensure that by the time we're using `poem`, it is a valid string and can be used in such a fashion. All in all the implementation feels long and a bit janky, for something really simple.

Let's discuss the other function, `writePoem`, which employs a nested try-catch block inside the catch clause of the root try catch block. This also feels anti-pattern-y. Little bit harder to explain why this code feels like it smells, but I think it can be reduced to the fact that nested try-catches obfuscate intention and add developer complexity overhead (not operational complexity overhead). It takes what could be a relatively simple and straightforward implementation and adds so much boilerplate. And with that, we arrive at an opinion: Try catch blocks are clunky, and prone to add additional boilerplate code that leaves us writing more when we want to be writing less.  

Let's move into revising the above examples to leverage `.catch()` chaining, and discuss any code smells that come up with that approach. 

I think in an ideal world, we want to abstract away the specifics of the try catch implementation. Really what we need is a way of representing, "hey this is an operation that might fail, and I want to know if it fails or passes because I want to handle each case differently".