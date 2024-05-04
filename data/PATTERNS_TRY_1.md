# Brevity

This article is going to be short, perhaps even a little opinionated (the worst). In every programming language, you encounter certain scenarios that require that you handle code that might fail. Maybe you try to open a file that doesn't exist or that you don't have permission to open. Maybe a network request goes down due to a server being offline. This article primarily offers opinions on scalable patterns to reduce boilerplate code in such scenarios, and to increase robustness and performance in certain scenarios.

If you're looking to develop a better foundation with regards to Error Handling in javascript, I'd recommend reading [Triton's Error Handling in Node Js](https://www.tritondatacenter.com/node-js/production/design/errors), which this post may refer to from time to time. Here's an excerpt from the post that I think will offer a decent starting point to this discussion on error handling:

> The general rule is that a function may deliver operational errors synchronously (e.g., by throwing [or returning the error]) or asynchronously (by passing them to a callback or emitting error on an EventEmitter), but it should not do both. This way, a user can handle errors by either handling them in the callback or using try/catch, but they never need to do both. Which one they use depends on what how the function delivers its errors, and that should be specified with its documentation.

This does a concise job of enumerating the options we have when dealing with potentially fallible code, and illustrating a core concept in exception handling - out of the several options that we have for handling exceptions, a particular function should only ever handle an exception in a single way. It should throw an error, OR pass the error to a callback OR emit theme on an EventEmitter, etc., but it shouldn't do more than one of the above  for a given function implementation.  

We can think of the phrase *operational error*, as being akin to "run-time problems experienced by correctly-written programs". With that in mind, let's move on to explore more concrete implementations and patterns.  

## Code Smells With Common Exception Handling Strategies

Okay so to illustrate some of what I'm hoping to break into, we're going to write a simple node program that is going to attempt to load a poem in the local file system based off of a command line arg that it's passed, and then it's going to cherry pick every prime numbered line in the poem and write a new poem based off those lines. Pretty straightforward and useless, so a great place to start.

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
...

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

...
```

So now that we have every prime line, we can write it out to a local file and spit out a little analysis of what we did to the console.  

```js
import { readFile, appendFile } from 'node:fs/promises';

...

async function run() {
    try {
        const filepath = getFileArg();
        const file = await readFile(`./poems/${filepath}`, { encoding: "utf8" });
        const lines = file.split("\n");
        const primeLines = takeEveryPrimeLine(lines);
        const filename = filepath.replace('.txt', '')
        await writePoem(filename, [...primeLines]);
        printAnalysis(filename, primeLines);
    } catch(e) {
        console.error(e);
    }
}

async function writePoem(name, poem) {
    const outfile = `./poems/${name}.prime.txt`
    await appendFile(outfile, name.toUpperCase() + '\n\n\n' , { encoding: 'utf8' });
    while(poem.length) {
        await appendFile(outfile, '\t' + poem.shift() + '\n', { encoding: 'utf8' });
    }
}

function printAnalysis(name, poem) {
    console.log(`
        Transcribed: ${name}.txt into ${name}.prime.txt;
        Wrote ${poem.length} lines.
        Run "cat ./poems/${name}.prime.txt" to print the poem to std output.
    `)
}

...

```

And our final program would look something like this:

```js
#! /usr/bin/env node

/**
 * Prime Poems,
 * 
 * This program will try to load a poem
 * local to the file system, 
 * and will take prime numbered lines, 
 * and emit metadata about the new 'prime poem' 
 */

import { readFile, appendFile, rm } from 'node:fs/promises';

async function run() {
    try {
        const filepath = getFileArg();
        const file = await readFile(`./poems/${filepath}`, { encoding: "utf8" });
        const lines = file.split("\n");
        const primeLines = takeEveryPrimeLine(lines);
        const filename = filepath.replace('.txt', '')
        await writePoem(filename, [...primeLines]);
        printAnalysis(filename, primeLines);
    } catch(e) {
        console.error(e);
    }
}

function getFileArg() {
    const args = process.argv.slice(2);
    if (args.length < 1) throw new Error("MISSING FILENAME ARGUMENT")
    return args[0];
}

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

async function writePoem(name, poem) {
    const outfile = `./poems/${name}.prime.txt`
    await appendFile(outfile, name.toUpperCase() + '\n\n\n' , { encoding: 'utf8' });
    while(poem.length) {
        await appendFile(outfile, '\t' + poem.shift() + '\n', { encoding: 'utf8' });
    }
}

function printAnalysis(name, poem) {
    console.log(`
        Transcribed: ${name}.txt into ${name}.prime.txt;
        Wrote ${poem.length} lines.
        Run "cat ./poems/${name}.prime.txt" to print the poem to std output.
    `)
}

await run();
```

It is a super simple program, it has some issues and doesn't clean up after itself if `appendFile` fails, but it's great for a poem like Howl where you're like 'Aw jeez, this thing is like 700 lines of darkness and I really only need like 34', and it allows us to illustrate a few code smells that come up when using try/catch/throw to handle exceptions that arise when writing programs.  

In this program, we have a single try/catch block implementation that contains all of the potentially fallible code that our program may encounter, which also means we're now allotted to handling all the exceptions from a single point of failure. By my count, our program could fail by improper command line arguments, failure to read a file, or any attempt it makes to append to a line to our outfile. That's 3(n = prime nums in poem) + 2 chances at failure, and we need to handle failure's in at least 3 different ways. We now need to build out clauses within our catch block, or structure an error handler in such a flexible way, that it may be able to appropriately handle N (in this case 3) failure methods. This ultimately becomes unscalable to approach error handling in larger applications in such a manner where a single or several highly overloaded catch blocks account for a majority of the exception handling logic, and it encourages writing massive handler functions that know and do too much.  

So by this logic, you'd say "well, okay but this is a result of your decision, Nick, to stuff all the fallible logic in the same try-catch block, if you delegated a try catch block internally to each function with a point of failure, you can handle error cases very specifically to each functional point of failure, and also the error handler code is now co-located to the function which is better right? Smaller, more intentional handlers is better? Right? Please?" Yeah okay, well lets grab our example above and do just that and see how we feel.  

```js
#! /usr/bin/env node

/**
 * Prime Poems,
 * 
 * This program will try to load a poem
 * local to the file system, 
 * and will take prime numbered lines, 
 * and emit metadata about the new 'prime poem' 
 */

import { readFile, appendFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';

async function run() {
    const filepath = getFileArg();
    const file = await readPoem(filepath);
    const lines = file.split("\n");
    const primeLines = takeEveryPrimeLine(lines);
    const filename = filepath.replace('.txt', '')
    await writePoem(filename, [...primeLines]);
    printAnalysis(filename, primeLines);
}

const AppErrorCodes = Object.freeze({
    MISSING_FILENAME: 1,
    READFILE_EXCEPTION: 2,
    WRITEFILE_EXCEPTION: 3
});

function getFileArg() {
    try {
      const args = process.argv.slice(2);
      if (args.length < 1) throw new Error("MISSING FILENAME ARGUMENT")
      return args[0];
    } catch(e) {
        console.error(`
            [ERROR]: Oops! This program requires that you supply it a .txt file to run. 
            You can do so by providing the filename as a command line argument.
        `);
        process.exit(AppErrorCodes.MISSING_FILENAME);
    }
}

async function readPoem(filepath) {
    try {
        const file = await readFile(`./poems/${filepath}`, { encoding: "utf8" });
        return file;
    } catch(e) {
        console.error(`
            [ERROR]: Oh no! This program couldn't read the file you provided.
            See below for output details.
                
                ${e}
        `);
        process.exit(AppErrorCodes.READFILE_EXCEPTION);
    }
}

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

async function writePoem(name, poem) {
    const outfile = `./poems/${name}.prime.txt`

    try {
      await appendFile(outfile, name.toUpperCase() + '\n\n\n' , { encoding: 'utf8' });
      while(poem.length) {
        await appendFile(outfile, '\t' + poem.shift() + '\n', { encoding: 'utf8' });
      }
    } catch(e) {
        console.error(`
            [ERROR]: Drat! You may not have write permissions on this host! WHO ARE YOU?!
            See Error Output Below:

                ${e}
        `);

        if (existsSync(outfile)) {
            try {
                await rm(outfile, { force: true });
            } catch(e) {
                console.error(`
                    [ERROR]: Can't brute force delete ${outfile}. 
                    Looks like you have to manually delete it.
                    Error output below:

                        ${e};
                `)
            }
        }

        process.exit(AppErrorCodes.WRITEFILE_EXCEPTION);
    }
}

function printAnalysis(name, poem) {
    console.log(`
        Transcribed: ${name}.txt into ${name}.prime.txt;
        Wrote ${poem.length} lines.
        Run "cat ./poems/${name}.prime.txt" to print the poem to std output.
    `)
}

await run();
```

I'm sure there's a language out there somewhere that has a phrase for something that's both better and worse, maybe German, but this is that. It's loads better, because the program is more robust and we're now locally handling exceptions that our operations throw, which is fantastic. But God, look at all this boilerplate. Our program was 60 lines. It's now 115. It's like our new program went and ate our old one. You could surely say that had we implemented robust error handling in the first example, our program would have been a lot longer. I'd say "EH, likely not". You likely still just want to report the error, clean the outfile if its there and exit. What is that 10 lines?  

I think this is better from a readability/mainitainability perspective, but what's worse about is one of the quasi non negotiable issues of leveraging try/catch/throw for exception handling: Every fallible op requires a minimum of 6 lines of boilerplate setup to safely run the op. That's like pretty dumb. I guess you're not forced into breaking into newlines, but that's also dumb. What psychopath is going to write:

```js
try { return myOp(); } catch(e) { handleMyOpFailure(e); };
```

That's about as short and clean as you're gonna make a try/catch one-liner, and I still would not want to be seen leaving the proverbial bar with it.  

If you look at the `writePoem` function rewrite, here's another code smell with try-catch, the nested try-catch. It is a degradation on the readability of that function. Let's compare the before and after:

```js

// Before

async function writePoem(name, poem) {
    const outfile = `./poems/${name}.prime.txt`
    await appendFile(outfile, name.toUpperCase() + '\n\n\n' , { encoding: 'utf8' });
    while(poem.length) {
        await appendFile(outfile, '\t' + poem.shift() + '\n', { encoding: 'utf8' });
    }
}

// After

async function writePoem2(name, poem) {
    const outfile = `./poems/${name}.prime.txt`

    try {
      await appendFile(outfile, name.toUpperCase() + '\n\n\n' , { encoding: 'utf8' });
      while(poem.length) {
        await appendFile(outfile, '\t' + poem.shift() + '\n', { encoding: 'utf8' });
      }
    } catch(e) {
        console.error(`
            [ERROR]: Drat! You may not have write permissions on this host! WHO ARE YOU?!
            See Error Output Below:

                ${e}
        `);

        if (existsSync(outfile)) {
            try {
                await rm(outfile, { force: true });
            } catch(e) {
                console.error(`
                    [ERROR]: Can't brute force delete ${outfile}. 
                    Looks like you have to manually delete it.
                    Error output below:

                        ${e};
                `)
            }
        }

        process.exit(AppErrorCodes.WRITEFILE_EXCEPTION);
    }
}

```

That's a real bummer. Sure we could abstract out some of that clean up logic to its own function with its own try-catch, and likely we should, but I think we're aware of the overall nagging point here: Try Catch -> More Boilerplate.  

Ideally what this is screaming is "Abstract me!", and that is the overall road we're going down.  

Im gonna shift gears a little bit here, and we'll refactor the above example to use `.catch` and explore how we feel about that. I think ultimately the node community is moving toward a point of agreement that *[callback hell](http://callbackhell.com/)* is something we'd like to leave in the past, so I'm not going to set up a whole callback example and walk through that. On that same vein, we'll likely also not explore the 'error' event + EventEmitter pattern, as the other three techniques are far more common for exception handling in most JS applications (except for *maybe* some event driven systems).

```js
#! /usr/bin/env node

import { readFile, appendFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';

async function run() {
  const filepath = getFileArg();
  const file = await readFile(`./poems/${filepath}`, {
    encoding: 'utf8'
  }).catch(handleReadFileError);
  const lines = file.split('\n');
  const primeLines = takeEveryPrimeLine(lines);
  const filename = filepath.replace('.txt', '');
  await writePoem(filename, [...primeLines]).catch(handleWriteError);
  printAnalysis(filename, primeLines);
}

const AppErrorCodes = Object.freeze({
  MISSING_FILENAME: 1,
  READFILE_EXCEPTION: 2,
  WRITEFILE_EXCEPTION: 3
});

function getFileArg() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error(`
            [ERROR]: Oops! This program requires that you supply it a .txt file to run. 
            You can do so by providing the filename as a command line argument.
        `);
    process.exit(AppErrorCodes.MISSING_FILENAME);
  }
  return args[0];
}

function handleReadFileError(e) {
  console.error(`
        [ERROR]: Oh no! This program couldn't read the file you provided.
        See below for output details.
            
            ${e}
    `);
  process.exit(AppErrorCodes.READFILE_EXCEPTION);
}

function takeEveryPrimeLine(poem) {
  return poem.filter((_, i) => isPrimeNum(i));
}

function isPrimeNum(num) {
  if (num < 2) return false;
  const sqrt = Math.sqrt(num);
  for (let x = 2; x <= sqrt; x++) {
    if (num % x === 0) return false;
  }
  return true;
}

async function writePoem(name, poem) {
  const outfile = `./poems/${name}.prime.txt`;
  await appendFile(outfile, name.toUpperCase() + '\n\n\n', {
    encoding: 'utf8'
  });
  while (poem.length) {
    await appendFile(outfile, '\t' + poem.shift() + '\n', { encoding: 'utf8' });
  }
}

async function handleWriteError(e) {
  console.error(`
        [ERROR]: Drat! You may not have write permissions on this host! WHO ARE YOU?!
        See Error Output Below:

            ${e}
    `);
  if (existsSync(outfile)) {
    await rm(outfile, { force: true }).catch(handleRmFileError);
  }
  process.exit(AppErrorCodes.WRITEFILE_EXCEPTION);
}

function handleRmFileError(e) {
  console.error(`
        [ERROR]: Can't brute force delete ${outfile}. 
        Looks like you have to manually delete it.
        Error output below:

            ${e};
    `);
}

function printAnalysis(name, poem) {
  console.log(`
        Transcribed: ${name}.txt into ${name}.prime.txt;
        Wrote ${poem.length} lines.
        Run "cat ./poems/${name}.prime.txt" to print the poem to std output.
    `);
}

await run();

```

I like this a lot better for a number of reasons: Coerces pattern of exception handling logic typically being abstracted out of the operational function logic. It's declarative and clear what's going on. It's more compact than the previous try/catch/throw example. However, `.catch()` 

## OOP

## Functional Programming
