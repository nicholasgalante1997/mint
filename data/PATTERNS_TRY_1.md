# Brevity

This article is going to be short, perhaps even a little opinionated (the worst). In every programming language, you encounter certain scenarios that require that you handle code that might fail. Maybe you try to open a file that doesn't exist or that you don't have permission to open. Maybe a network request goes down due to a server being offline. This article primarily offers opinions on scalable patterns to reduce boilerplate code in such scenarios, and to increase robustness and performance in certain scenarios.

If you're looking to develop a better foundation with regards to Error Handling in javascript, I'd recommend reading [Triton's Error Handling in Node Js](https://www.tritondatacenter.com/node-js/production/design/errors), which this post may refer to from time to time. Here's an excerpt from the post that I think will offer a decent starting point to this discussion on error handling:

> The general rule is that a function may deliver operational errors synchronously (e.g., by throwing [or returning the error]) or asynchronously (by passing them to a callback or emitting error on an EventEmitter), but it should not do both. This way, a user can handle errors by either handling them in the callback or using try/catch, but they never need to do both. Which one they use depends on what how the function delivers its errors, and that should be specified with its documentation.

This does a concise job of enumerating the options we have when dealing with potentially fallible code, and the conditions in which best practices dictate we should leverage each. We can think of the phrase *operational error*, as being akin to "run-time problems experienced by correctly-written programs". With that in mind, let's move on to explore more concrete implementations and patterns.  

## Differentiating on Function Type

Whereas the above post from Triton makes an important distinction on which Error Handling approach to take based on whether the function is synchronous or asynchronous, this post will deviate slightly and instead will leverage throw/try/catch for both synchronous and asynchronous operations that return a value, and will leverage callbacks for void functions that are pure side effects, and I'll offer context as to why.

Functional code that returns a value is often blocking in regards to the execution environment calling it. Either the value returned from the function is needed for some later computation in the body of the function, or the value is itself propagated out of the function by being returned to the calling scope.  

Void functions, sync or async, are often mutative in some capacity, and 

### Utility Classes

### Using Functions
