import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This file contains constants for paths to JSON files used in the application
export const ASSIGNMENTS_PATH = path.resolve(
  __dirname,
  "./product_assignment.json"
);
export const CHARGES_PATH = path.resolve(__dirname, "./product_charges.json");
