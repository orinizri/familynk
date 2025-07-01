import fs from "fs";
import fsp from "fs/promises";
import AppError from "./appError.js";
import { STREAM_THRESHOLD_BYTES, FILE_ENCODING } from "./constants.js";

/**
 * Reads a JSON file and returns its content.
 * If the file is small enough, it reads the entire content at once.
 * For larger files, it streams the content to avoid memory issues.
 * @param {string} filePath - The path to the JSON file.
 * @param {Object} options - Options for reading the file.
 * @param {number} options.streamThresholdBytes - The size threshold for streaming (default: 5MB).
 * @param {string} options.encoding - The encoding to use when reading the file (default: 'utf8').
 * @return {Promise<Object>} - A promise that resolves to the parsed JSON content.
 * @throws {AppError} - Throws an error if the file cannot be read or parsed.
 */
export async function readJson(filePath, options = {}) {
  const {
    streamThresholdBytes = STREAM_THRESHOLD_BYTES || 5 * 1024 * 1024, // Default to 5MB
    encoding = FILE_ENCODING,
  } = options;

  try {
    const { size } = await fsp.stat(filePath);

    // If the file is small enough, read it all at once
    if (size <= streamThresholdBytes) {
      const content = await fsp.readFile(filePath, encoding);
      if (!content) {
        throw new AppError(`File is empty: ${filePath}`, 400);
      }
      try {
        return JSON.parse(content);
      } catch (err) {
        throw new AppError(`JSON parse error: ${err.message}`, 400);
      }
    }

    // Stream for large files
    return await new Promise((resolve, reject) => {
      let buffer = "";
      const stream = fs.createReadStream(filePath, { encoding });

      stream.on("data", (chunk) => (buffer += chunk));

      stream.on("end", () => {
        try {
          resolve(JSON.parse(buffer));
        } catch (err) {
          reject(new AppError(`Stream parse error: ${err.message}`, 400));
        }
      });

      stream.on("error", (err) => {
        reject(new AppError(`Stream read error: ${err.message}`, 500));
      });
    });
  } catch (err) {
    // Catch stat/readFile failure
    if (err instanceof AppError) throw err;
    throw new AppError(
      `Failed to load file: ${filePath} - ${err.message}`,
      500
    );
  }
}
