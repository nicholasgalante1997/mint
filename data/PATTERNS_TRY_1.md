# Brevity

This article is going to be short, perhaps even a little opinionated (the worst). In every programming language, you encounter certain scenarios that require that you handle code that might fail. Maybe you try to open a file that doesn't exist or that you don't have permission to open. Maybe a network request goes down due to a server being offline. This article primarily offers opinions on scalable patterns to reduce boilerplate code, and to increase robustness and performance in such scenarios.  

If you're looking to develop a better foundation with regards to Error Handling in javascript, I'd recommend reading [Triton's Error Handling in Node Js](https://www.tritondatacenter.com/node-js/production/design/errors), which this post may refer to from time to time. Here's an excerpt from the post that I think will offer a decent starting point to this discussion on error handling:

> The general rule is that a function may deliver operational errors synchronously (e.g., by throwing [or returning the error]) or asynchronously (by passing them to a callback or emitting error on an EventEmitter), but it should not do both. This way, a user can handle errors by either handling them in the callback or using try/catch, but they never need to do both. Which one they use depends on what how the function delivers its errors, and that should be specified with its documentation.

We can think of the phrase *operational error*, as being akin to "run-time problems experienced by correctly-written programs".  

This does a concise job of enumerating the options we have when dealing with potentially fallible code, and illustrating a core concept in exception handling - out of the several options that we have for handling exceptions, a particular function should only ever handle an exception in a single way. It should throw an error, OR pass the error to a callback OR emit theme on an EventEmitter, etc., but it shouldn't do more than one of the above for a given function implementation. With that in mind, let's move on to explore more concrete implementations and patterns.

## Patterns

> From here on out, it's a lot of opinion. Tread lightly.

From the options listed above, there are two categorical approaches to error handling: a synchronous approach where the error is returned or thrown to the calling scope, and an asynchronous approach where a callback is invoked and passed the error, or an event is emitted for handling. We will leverage both, but with targeted use cases.  

For functions or methods that return a value, promise or synchronous, we will *return any errors thrown during operation back to the calling scope*, and we'll do so in a manner that standardizes the API for retrieving data and errors off of operations that return a value and *may* throw an error. An example of this type of function is `require('node:fs/promises').readFile`, which is an asynchronous function that returns the contents of a file or throws an error if an error occurs during an attempt to read a file.  

For functions or methods whose return type is `void | Promise<void>`, we will treat these functions unilaterally as [side effects](https://softwareengineering.stackexchange.com/questions/40297/what-is-a-side-effect) and we will handle any exceptions thrown during these operations asynchronously via callbacks.  

Here's a brief overview of the rationale. Functions or methods that return a value to the calling scope are often considered blocking to their execution context if the execution context plans to use that value. With the standard adoption of es6's async/await syntax, we very rarely see examples of [callback hell](http://callbackhell.com/) anymore, and a lot of that mangled nested code has been replaced with `async/await` for async functions that return a value or sync functions that once used callbacks and can be promisified using `require('util').promisify`. So the budding pattern that the node.js community is adopting, whether it's intended or not, is if a function returns a value that's leveraged by the invoking scope, it's common that that function is awaited if the invoking function is asynchronous, or blocking to the calling scope if its synchronous. To that degree, it makes sense to pass any errors thrown during execution back to the calling scope, since the calling scope has a *dependency* on this returned value, and let it decide how to proceed in the event of failure.  

For side effects, we do not need to block any execution, we don't need to then return a value to the calling scope variably to indicate we've failed. In such cases, it makes more sense to pass a callback in the event of failure and handle it asynchronously, if and when the error event occurs. This allows us to maintain a consistent return type (void), whether or not an exception occurs during operation.

Let's move into types and implementations. 👍  

## OOP

> I still like Object Oriented Programming in a lot of cases. It promotes readability, it's familiar across varied levels of developers.

The following types and implementations are going to be implemented using typescript, and class syntax, and the approach to code structuring is going to be Object Oriented Programming.

**Callback**  

```ts
export interface Callback<T> {
  (...args: any[]): T;
}
```

The type `Callback<T>` is a base representation of a callable operation that may or may not return a value. This can also represent an asynchronous operation by passing `Callback<Promise<T>>`.

We can extend this type to represent a `SideEffect` that does not return a value in the following way:

```ts
export interface SideEffect extends Callback<void | Promise<void>> {
  (...args: any): void | Promise<void>;
}
```

So now we've set up SideEffect as an interface that extends from `Callback<void | Promise<void>>` to ensure that the return type of a `SideEffect` is either `void` (synchronous) or `Promise<void>` (asynchronous).

**SafeInvocation**  

> A SafeInvocation Object or Class represents an entity that is capable of performing a fallible operation, sync or async, and affords consuming code the ability to peek into the state of an operation. It has a uniform API for representing the completed state of an operation (failed|passed).

SafeInvocation is a private static utility class. It is typically not publicly available to the package code, and rather it is going to be leveraged internally inside of `class Option {}`, and `class Attempt {}`, to facilitate invoking code that might throw an error. It has two public static methods: `execute` and `executeAsync` which invoke a synchronous fallible function and an asynchronous fallible function respectively.  

> Promise.resolve(): A Brief Aside
>
> Why are we using two separate functions to invoke async and sync functions separately when we could be resolving both with [Promise.resolve()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)?
>
> We want to retain synchronous execution for synchronous functions, where Promise.resolve forces us into `.then` and asynchronous handling.

Let's start by setting up types and our implementation for `execute`, which will call a synchronous function safely, and return an `ExecutionResult<T>`

```ts
export enum InvocationState {
  IDLE,
  SUCCESS,
  FAILED
}

export interface ExecutionResult<T> {
  data: T | null;
  error: Error | null;
  status: InvocationState;
}
```

So we've set up an interface `ExecutionResult` which consists of metadata representing a completed operation. We have a means of delineating if the operation was successful, and we have access to the resolved value or the thrown error.

We can extend the base `ExecutionResult<T>` to represent Success and Failure states specifically, in the following way:

```ts
export enum InvocationState {
  IDLE,
  SUCCESS,
  FAILED
}

export interface ExecutionResult<T> {
  data: T | null;
  error?: Error | null;
  status: InvocationState;
}

export interface SuccessfulExecution<T> extends ExecutionResult<T> {
  data: T;
  error: null;
  status: InvocationState.SUCCESS;
}

export interface FailedExecution extends ExecutionResult<never> {
  data: null;
  error: Error;
  status: InvocationState.FAILED;
}
```

Now we can begin to define an interface for our SafeInvocation class:

> When it comes time for implementation, we won't actually use this interface as Typescript has some weird behavior around interface satisfaction and static methods. See [the second answer on this stack overflow post](https://stackoverflow.com/questions/13955157/how-to-define-static-property-in-typescript-interface).

```ts
interface ISafeInvocation {
    execute<T extends Callback<R>, R = any>(callback: T): SuccessfulExecution<R> | FailedExecution;
}

/**
 * WHERE
 * 
 * T is the typeof function (Callback<R>) we want to invoke
 * R is the return type of T (ReturnType<T>)
 * */
```

This declaration states, we are declaring that the method `execute` will accept a single callback of type `Callback<T>` and will return either a `SuccessfulExecution<R>` or a `FailedExecution`.

That's a pretty solid definition. Let's get to implementing it!

```ts
class SafeInvocation {
  static execute<T extends Callback<R>, R = any>(callback: T): SuccessfulExecution<R> | FailedExecution {
    let data;
    let error = null;
    let status = InvocationState.IDLE;
    try {
      data = callback();
      status = InvocationState.SUCCESS;
      return {
        data,
        error,
        status
      };
    } catch (e: unknown) {
      data = null;
      status = InvocationState.FAILED;

      if (e instanceof Error) {
        error = e;
      }

      if (typeof e === 'string') {
        error = new Error(e);
      }

      if (error == null) {
        error = new Error(JSON.stringify(e)); // Caution: JSON.stringify itself throws an error if it attempts to stringify a recursive value
      }

      return {
        data,
        error,
        status
      };
    }
  }
}
```

Okay, not the shortest implementation possible, but it's very clear what's going on. We wrap our callback in an try-catch block, and we attempt to call it and assign the return value to data. If that's a success, return a `SuccessfulExecution<R>` by proxying data out of the function by returning it as the data field of the `SuccessfulExecution<R>`. If we've failed or thrown an error, catch it, assign it to the local variable error and return a `FailedExecution` with the error being proxied out of the function as the error field of the `FailedExecution`.  It's hyper readable, and it satisfies our requirement of safely invoking a function and returning metadata about the result of the operation.  

We can very easily reuse certain paradigms in our `executeAsync` implementation, with slightly different types.

We're going to adjust the Async types slightly to support syntax that Promises are more closely associated with: resolved and rejected.

```ts
export interface AsyncExecution<T> {
  data: T | null;
  error?: Error;
  resolved: boolean;
  rejected: boolean;
}

export interface ResolvedAsyncExecution<T> extends AsyncExecution<T> {
  data: T;
  resolved: true;
  rejected: false;
}

export interface RejectedAsyncExecution extends AsyncExecution<never> {
  data: null;
  error: Error;
  resolved: false;
  rejected: true;
}
```

Now we can set up our stub definition for `executeAsync`

```ts
interface ISafeInvocation {
    execute<T extends Callback<R>, R = any>(callback: T): SuccessfulExecution<R> | FailedExecution;
    executeAsync<T extends Callback<Promise<R>>, R = any>(callback: T): Promise<ResolvedAsyncExecution<R> | RejectedAsyncExecution>;
}
```

We're declaring an contract for an asynchronous function that will accept an asynchronous callback, and will return a Promise that resolves to either a `ResolvedAsyncExecution<R>` or a `RejectedAsyncExecution`. Now let's implement it.

```ts
class SafeInvocation {
  /** Refactor execute to use #handleException */
  static execute<T extends Callback<R>, R = any>(callback: T): SuccessfulExecution<R> | FailedExecution {
    let data;
    let status = InvocationState.IDLE;
    try {
      data = callback();
      status = InvocationState.SUCCESS;
      return {
        data,
        status
      };
    } catch (e: unknown) {
      return this.#handleException(e, 'sync') as FailedExecution;
    }
  }

  static async executeAsync<T extends Callback<Promise<R>>, R = any>(
    callback: T
  ): Promise<ResolvedAsyncExecution<R> | RejectedAsyncExecution> {
    let resolved = false;
    let rejected = false;
    let data;

    try {
      data = await callback();
      resolved = true;
      return {
        data,
        resolved,
        rejected
      };
    } catch (e) {
      return this.#handleException(e, 'async') as RejectedAsyncExecution;
    }
  }

  static #handleException(e: unknown, invokee: 'sync' | 'async'): FailedExecution | RejectedAsyncExecution {
    let error = null;
    
    if (e instanceof Error) {
      error = e;
    }

    if (typeof e === 'string') {
      error = new Error(e);
    }

    if (error == null) {
      error = new Error('UnknownException');
    }

    if (invokee === 'sync') {
      return {
        data: null,
        error,
        status: InvocationState.FAILED
      } as FailedExecution;
    } else {
      return {
        data: null,
        error,
        rejected: true,
        resolved: false
      } as RejectedAsyncExecution;
    }
  }
}

```

Not bad. We were able to abstract out the commonalities of exception handling to the private static method `#handleException`, and then we reimplemented the base logic for trying an operation, but leveraging async/await syntax since this operation is async.  

So now we have a reliable way to call an operation that might fail, and a declarative api for working with the possible values returned from the operation. Now let's apply the `SafeInvocation` class in a more opinionated manner for side effects, and set up our `Attempt` class.

**Attempt**  

> An instance of the Attempt Class represents the lazy intention to perform a side effect. By default, Attempts are lazy, meaning they will not invoke their passed callback on instantiation, unless forced to eagerly invoke the operation via configuration setting. Only synchronous operations can have immediate (in-constructor) invocation. Async side effects cannot be awaited from within a constructor without having the constructor variably return alternating values, which we won't (read *shouldn't*) do.

An instance of an Attempt represents a side effect that we'd like to manage. An attempt can benefit from baked in retry logic, to facilitate achieving the side effect if initial attempts fail. An attempt may not be cached (intended for usage with side effects, so caching would be contrary to our use case.).

Here's our first go at a rough interface for an Attempt:

```ts
enum AttemptState {
  IDLE,
  FAILED,
  SUCCEEDED,
  IN_PROGRESS,
  RETRYING
}

interface AttemptConfiguration {
  callback: SideEffect;
  onError?: ((e: Error) => void) | null;
  immediate?: boolean;
  retries?: number;
  delay?: number | number[];
};

interface IAttempt {
  readonly callback: SideEffect;
  onError: ((e: Error) => void) | null;
  immediate: boolean;
  retries: number;
  delay: number | number[];
  runSync(): void;
  run(): Promise<void>;
}
```

So you'll notice that our AttemptConfiguration interface and our IAttempt interface share some commonalities. To keep our configuration options in sync with our interface definition, we should refactor the above to leverage `&` type syntax or use `Pick/Omit` or some type of type sharing. What the AttemptConfiguration represents is an object we can pass when we instantiate a new Attempt that will give us greater granularity over the behavior of our attempt instance. We also want to allow for our Attempt to be instantiated with just a callback for basic use cases.

Let's start to implement that class now:

```ts
class Attempt implements IAttempt {
  #tryN = 0;
  #state = AttemptState.IDLE;

  callback: SideEffect;
  onError: ((e: Error) => void) | null;
  immediate: boolean;
  retries: number;
  delay: number | number[];

  constructor(value: AttemptConfiguration | SideEffect) {\
    if (isAttemptConfiguration(value)) {
      this.callback = value.callback;
      this.onError = value.onError ?? null;
      this.immediate = !!value?.immediate;
      this.retries = value?.retries ?? 0;
      this.delay = value?.delay ?? 0;
    } else {
      this.callback = value;
      this.onError = null;
      this.immediate = false;
      this.retries = 0;
      this.delay = 0;
    }

    if (this.immediate) {
      this.runSync();
    }
  }
}

function isAttemptConfiguration(value: SideEffect | AttemptConfiguration): value is AttemptConfiguration {
  if (typeof value === 'function') return false;
  if (typeof value?.callback !== "undefined") {
    if (typeof value.callback !== "function") {
      return false;
    }
  }
  if (typeof value?.onError !== "undefined") {
    if (typeof value?.onError !== "function") {
      return false;
    }
  }
  if (typeof value?.retries !== "undefined") {
    if (typeof value?.retries !== "number") {
      return false;
    }
  }
  if (typeof value?.delay !== "undefined") {
    const notNumber = typeof value?.delay !== "number";
    const notArray = !Array.isArray(value);

    if (notNumber && notArray) {
      return false;
    }
  }
  return true;
}

```

If you're unfamiliar with type guard syntax, [check out this typescript article](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) which explains what type guards are. Basically, we check to see what we've been instantiated with. If it's a configuration object, set our local fields to the values of that configuration object or a default value. If it is a callback, set our local fields to the default behavior values. If we've been configured to run immediately by setting immediate to true, then we call runSync() from inside the constructor. Constructors are synchronous by default.  

Let's move forward with implementing our `run` and `runSync` functions.

```ts

...

class Attempt implements IAttempt {

  ...

  runSync(...args: any[]): void {
    this.#state = AttemptState.IN_PROGRESS;

    if (this.callback == null) {
      this.#state = AttemptState.FAILED;
      return;
    }

    const { status, error } = SafeInvocation.execute(() => this.callback(...args));

    if (status === InvocationState.FAILED) {
      this.#state = AttemptState.FAILED;

      if (this.retries > this.#tryN) {
        this.#state = AttemptState.RETRYING;
        this.#tryN += 1;

        if (Array.isArray(this.delay)) {
          setTimeout(this.runSync.bind(this, ...args), this.delay[this.#tryN] ?? 0)
        } else if (this.delay > 0) {
          setTimeout(this.runSync.bind(this, ...args), this.delay)
        } else {
          this.runSync(...args);
          return;
        }
      }

      if (this.onError) {
        this.onError(error);
      }

      return;
    }

    this.#state = AttemptState.SUCCEEDED;
  }

  async run(...args: any[]): Promise<void> {
    this.#state = AttemptState.IN_PROGRESS;

    if (this.callback == null) {
      this.#state = AttemptState.FAILED;
      return;
    }

    await SafeInvocation.executeAsync(async () => await (this.callback as Callback<Promise<void>>)(...args)).then(async (result) => {
      const { rejected } = result;
      if (rejected) {
        const { error } = result as RejectedAsyncExecution;

        this.#state = AttemptState.FAILED;

        if (this.retries > this.#tryN) {
          this.#state = AttemptState.RETRYING;
          this.#tryN += 1;

          if (Array.isArray(this.delay)) {
            setTimeout(this.run.bind(this, ...args), this.delay[this.#tryN] ?? 0)
          } else if (this.delay > 0) {
            setTimeout(this.run.bind(this, ...args), this.delay)
          } else {
            await this.run(...args);
            return;
          }
        }

        if (this.onError) {
          this.onError(error);
        }

        return;
      }

      this.#state = AttemptState.SUCCEEDED;
    });
  }

  get state() {
    return this.#state;
  }
}

...

```

Okay so let's start with runSync. We are first changing our internal state to reflect we're in the course of performing an operation. Then, we use our `SafeInvocation` class to perform the passed callback safely and return to us our `ExecutionResult` response. If the side effect failed, we check if we're intended to retry the operation. If we want to retry, we update our internal state and use recursion to re-call runSync() from inside the body of runSync(). If we failed and we don't want to retry, we check if we've been passed an error handler. If we have, we invoke the supplied error handler with the error we've caught. Then we update our internal state to reflect that we've failed and we return early. If we've succeeded, we update our internal state to reflect the operation succeeded and then we return. Our asynchronous `run` function is implemented in an almost identical way except that it's an asynchronous function and it internally leverages `executeAsync` as opposed to `execute`.  

What are the benefits of writing our side effects in this way? We get to bake in retry logic into functions we want to retry on failure, without needing to set up retry logic for each function. We also get the benefit of encapsulating side effect exception handling from within the code that's invoking the function that might fail. Because our Attempts are lazy by design, we can pass them around for later invocation or we can eagerly invoke our side effect code when we configure/instantiate our Attempt.  

Here's our final `Attempt` class:

```ts

...

class Attempt implements IAttempt {
  #tryN = 0;
  #state = AttemptState.IDLE;

  callback: SideEffect;
  onError: ((e: Error) => void) | null;
  immediate: boolean;
  retries: number;
  delay: number | number[];

  constructor(value: AttemptConfiguration | SideEffect) {
    if (isAttemptConfiguration(value)) {
      this.callback = value.callback;
      this.onError = value.onError ?? null;
      this.immediate = !!value?.immediate;
      this.retries = value?.retries ?? 0;
      this.delay = value?.delay ?? 0;
    } else {
      this.callback = value;
      this.onError = null;
      this.immediate = false;
      this.retries = 0;
      this.delay = 0;
    }

    if (this.immediate) {
      this.runSync();
    }
  }

  runSync(...args: any[]): void {
    this.#state = AttemptState.IN_PROGRESS;

    if (this.callback == null) {
      this.#state = AttemptState.FAILED;
      return;
    }

    const { status, error } = SafeInvocation.execute(() => this.callback(...args));

    if (status === InvocationState.FAILED) {
      this.#state = AttemptState.FAILED;

      if (this.retries > this.#tryN) {
        this.#state = AttemptState.RETRYING;
        this.#tryN += 1;

        if (Array.isArray(this.delay)) {
          setTimeout(this.runSync.bind(this, ...args), this.delay[this.#tryN] ?? 0)
        } else if (this.delay > 0) {
          setTimeout(this.runSync.bind(this, ...args), this.delay)
        } else {
          this.runSync(...args);
          return;
        }
      }

      if (this.onError) {
        this.onError(error);
      }

      return;
    }

    this.#state = AttemptState.SUCCEEDED;
  }

  async run(...args: any[]): Promise<void> {
    this.#state = AttemptState.IN_PROGRESS;

    if (this.callback == null) {
      this.#state = AttemptState.FAILED;
      return;
    }

    await SafeInvocation.executeAsync(async () => await (this.callback as Callback<Promise<void>>)(...args)).then(async (result) => {
      const { rejected } = result;
      if (rejected) {
        const { error } = result as RejectedAsyncExecution;

        this.#state = AttemptState.FAILED;

        if (this.retries > this.#tryN) {
          this.#state = AttemptState.RETRYING;
          this.#tryN += 1;

          if (Array.isArray(this.delay)) {
            setTimeout(this.run.bind(this, ...args), this.delay[this.#tryN] ?? 0)
          } else if (this.delay > 0) {
            setTimeout(this.run.bind(this, ...args), this.delay)
          } else {
            await this.run(...args);
            return;
          }
        }

        if (this.onError) {
          this.onError(error);
        }

        return;
      }

      this.#state = AttemptState.SUCCEEDED;
    });
  }

  get state() {
    return this.#state;
  }
}

...

export { Attempt, AttemptState };
```

**Option**  

> An instance of the Option Class represents the lazy intention to perform an operation that might fail, and return the value to the calling scope. By default, Options are lazy, meaning they will not invoke their passed callback on instantiation. Options cannot be configured to be invoked immediately, as that would force the constructor of our Option class to have a variable return type, sometimes returning an Option class, and sometimes returning the safe result of the callback operation. Options can be retried. Options can be cached, so that if our parameters haven't changed, we don't need to recompute the value.  

Options are actually not a new concept and I won't pretend that it's novel or something I devised. This is really directly borrowed from Rust, and before that Java. The Option is intended to allow developers to circumvent the use of null to indicate a value that's potentially nothing. There's a number of issues with null in pragmatic application development, so much so in fact that there's a [famous keynote speech where it was coined the billion dollar mistake](https://www.infoq.com/presentations/Null-References-The-Billion-Dollar-Mistake-Tony-Hoare/). So in the spirit of stealing (borrowing, wink) directly from Rust, here's a brief excerpt from the rust programming language book that provides an overview of why Options are necessary.

> The problem with null values is that if you try to use a null value as a not-null value, you’ll get an error of some kind. Because this null or not-null property is pervasive, it’s extremely easy to make this kind of error.
>
> However, the concept that null is trying to express is still a useful one: a null is a value that is currently invalid or absent for some reason.

Enter Options. An Option can be Some or None. It can be a value or it can be the absence of a value. An option can represent a number or a string, etc. but you can't perform numeric or string operations on the Option without first obtaining it's inner value. That's the beauty of the option. Here's a brief quasi-pseudocode example:

```js
let numOrNull = opThatReturnsNumOrNull();
let numSquared = numOrNull * numOrNull; // Sometimes this works just fine, sometimes this will error


```

## Benchmarking

## Appendix

> You don't need to read this if you don't care to. It's also subject to change more frequently and with less caution than the above sections of the article. This current section is *Work In Progress*

### Nick's Digression On Code Smells With Common Exception Handling Strategies

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

I like this a lot better for a number of reasons: Coerces pattern of exception handling logic typically being abstracted out of the operational function logic. It's declarative and clear what's going on. It's more compact than the previous try/catch/throw example.
