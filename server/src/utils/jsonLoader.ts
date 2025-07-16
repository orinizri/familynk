// import fsp from "fs/promises";
// import AppError from "./AppError.ts";
// import { FILE_ENCODING } from "./constants.ts";
// import { retryAsync } from "./retry.ts";
// import { logger } from "./logger.ts";
// /**
//  * @param {string} filePath
//  * @param {z.ZodType<T>=} schema   Optional Zod schema for shape validation
//  * @param {Object} options
//  * @param {string=} options.encoding  (default: FILE_ENCODING)
//  * @param {number=} options.retries   (default: 3)
//  */
// export async function readJson(filePath, zodValidation = null, options = {}) {
//   // TODO: For larger files, stream the content
//   const { encoding = FILE_ENCODING } = options;

//   try {
//     let content;
//     // If the file is small enough, read it all at once
//     try {
//       content = await retryAsync(() => fsp.readFile(filePath, encoding));
//     } catch (error) {
//       throw new AppError(
//         `Failed to read file after retries: ${error.message}`,
//         500
//       );
//     }
//     let data;
//     try {
//       // 1) Pure JSON syntax check
//       data = JSON.parse(content);
//     } catch (error) {
//       throw new AppError(`JSON parse error: ${error.message}`, 400);
//     }
//     if (zodValidation === null) return data;
//     try {
//       // 2) Schema/shape validation
//       const zodParsed = zodValidation.parse(data);
//       return zodParsed;
//     } catch (error) {
//       logger.error(error, "Zod validation error:");
//       // ZodIssue[]
//       const messages = error.errors.map(
//         (e) => `${e.path.join(".")}: ${e.message}`
//       );
//       throw new AppError(`JSON validation error: ${messages.join("; ")}`, 400);
//     }
//   } catch (error) {
//     // Catch stat/readFile failure
//     if (error instanceof AppError) throw error;
//     throw new AppError(
//       `Failed to load file: ${filePath} - ${error.message}`,
//       500
//     );
//   }
// }
