import { readJson } from "../utilities/readJson.js";
import { ASSIGNMENTS_PATH, CHARGES_PATH } from "./constants.js";

/**
 * Loads assignments from the JSON file.
 * @returns {Promise<Object[]>} - A promise that resolves to the assignments data.
 * * @throws {AppError} - Throws an error if the file cannot be read or parsed.
 */
export const loadAssignments = () => readJson(ASSIGNMENTS_PATH);
export const loadCharges = () => readJson(CHARGES_PATH);
