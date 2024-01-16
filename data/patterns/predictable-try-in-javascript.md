# Outline Section

1. What is this article about?
   1. Handling errors in javascript in a more predictable manner
2. Code Smells with Try Catch
   1. Realistic application examples create ambiguous failure points in try blocks
   2. Abstracting internal `try-catch` logic to each potentially fallable function results in a similar boiler-plate code lift, which feels adversarial to DRY principles.
      1. What if we need to update how we're handling errors? Now we need to update it everywhere we have a catch block
   3. Nesting `try-catch` blocks leads to unreadable and difficult to maintain code, as well as extra boiler plate code to lift the variable back into usable scope

---

# Foreward

This article is going to discuss exception handling in javascript (and also typescript), and then approach several code smells that could be easily associated with conventional try-catch blocks in production applications. I'll then offer an alternative pattern based on the Java or Rust 'Option' concept.

# Error Handling in Javascript

Javascript offers several methods for handling errors that could be thrown during the execution of your code. For synchronus operations, it's often conventional to wrap fallable code execution in a try-catch block. When working with promises, the standard Javascript Promise definition allows for attaching a .catch block to a promise, which accepts a function that will be executed if an error occurs during the resolution of the promise (aka a rejection). With the emergence of async/await syntax with ES6, asynchronous fallable code can now also be handled with try catch blocks, allowing for more uniform syntax and an overall better developer experience (less syntax switching).

Below is an example of a try catch block that encapsulates an attempt to read a file. This operation could fail because the file could have the incorrect permissions, or not exist at all.

```javascript
import fs from 'fs';
import path from 'path';

(async () => {
   try {
      console.log(await fs.readFile())
   } catch(e) {

   }
})();
```
