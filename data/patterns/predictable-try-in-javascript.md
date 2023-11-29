# Abstract

This article is about handling operations that could fail in typescript, leveraging `try-catch` code blocks, for altogether cleaner and more readable implementation code. This implementation leans on the notion of Options, which is a concept in both Java and Rust programming, where a given value could be something or nothing.

## Foreground - The Problem Space  

In the course of application development, as functionality and complexity grow, it's likely you arrive at a situation in which you'll introduce some logic or code that could fail on execution, whether that be due to a failed network request, or invalid user input, or any other means of failed execution. In Javascript and Typescript development, you could handle these cases leveraging try-catch blocks, to more gracefully handle error cases that could arise during application execution. A typical implementation pattern might resemble the following:

~~~ts

function opCouldFail() {
    /** logic */
}

try {
    const data = opCouldFail();
    /** Do something with data */
} catch (e: unknown) {
    console.error('An error occurred', e);
}

~~~

With the above block in place, if an error were to occur during the execution of `opCouldFail()`, our program would continue, as we've handled the error programmatically via implementing a catch block. Without implementing a catch block for handling errors that arise during the execution of our code, we're defaulting to relying on the behavior of the execution environment for encountering errors. We typically do not want to do this, for example the NodeJS engine will exit the active NodeJS Process with a non-zero error code when the engine encounters an unhandled exception thrown in the course of application execution.  

### Code Smells That Might Arise

- Realistic application examples create ambiguous failure points in try blocks
- Abstracting internal `try-catch` logic to each potentially fallable function results in a similar boiler-plate code lift, which feels adversarial to DRY principles.
  - What if we need to update how we're handling errors? Now we need to update it everywhere we have a catch block
- Nesting `try-catch` blocks leads to unreadable and difficult to maintain code

