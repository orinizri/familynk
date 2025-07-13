import path from "path";
import { fileURLToPath } from "url";

// Importing path module to handle file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This file contains constants for paths to JSON files used in the application
export const ASSIGNMENTS_PATH = path.resolve(
  __dirname,
  "../",
  "../",
  "data",
  "./product_assignment.json"
);
export const CHARGES_PATH = path.resolve(
  __dirname,
  "../",
  "../",
  "data",
  "./product_charges.json"
);
