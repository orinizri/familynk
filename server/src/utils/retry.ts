// /**
//  * Retry an async function with exponential backoff.
//  *
//  * @template T
//  * @param {() => Promise<T>} fn
//  *    — The async function to invoke. Should return a Promise.
//  * @param {Object} [options]
//  * @param {number} [options.retries=3]
//  *    — Number of attempts before giving up.
//  * @param {number} [options.initialDelay=100]
//  *    — Delay in milliseconds before first retry.
//  * @param {number} [options.factor=2]
//  *    — Exponential backoff multiplier.
//  * @param {number} [options.maxDelay=2000]
//  *    — Maximum delay between retries.
//  * @return {Promise<T>}
//  *    — Resolves with the fn() result or rejects after all retries fail.
//  * @throws {Error}
//  *    — The last error thrown by fn().
//  */
// export async function retryAsync(fn, options = {}) {
//   const {
//     retries = 3,
//     initialDelay = 100,
//     factor = 2,
//     maxDelay = 2000,
//   } = options;

//   let attempt = 0;
//   let delay = initialDelay;
//   let lastError;

//   while (attempt < retries) {
//     // Each loop invokes fn()
//     try {
//       return await fn();
//     } catch (error) {
//       lastError = error;
//       attempt += 1;
//       // If we’ve exhausted all attempts, break out
//       if (attempt === retries) break;
//       // wait before next try
//       await new Promise((resolve) =>
//         setTimeout(resolve, Math.min(delay, maxDelay))
//       );
//       // Exponentially increase the delay for the next round
//       // but do not exceed maxDelay
//       delay *= factor;
//     }
//   }

//   // all attempts failed
//   throw lastError;
// }
