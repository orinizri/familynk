/**
 * Parses a value into a number, preserving decimal places.
 * - If the input is already a number, it’s returned as-is.
 * - If it’s a string, it uses Number(...) (or parseFloat) to convert.
 * - If conversion fails, returns NaN.
 *
 * @param {string|number} input
 * @returns {number} The parsed number (with decimals), or NaN on failure.
 */
export function parseNumber(input) {
  // Already a number? return it
  if (typeof input === "number") {
    return input;
  }

  // Only strings are supported beyond numbers
  if (typeof input !== "string") {
    console.warn(
      `parseNumber(): expected string or number but got ${typeof input}`
    );
    return NaN;
  }

  // Let JS parse the full floating-point value
  const n = Number(input); // or: parseFloat(input)
  if (Number.isNaN(n)) {
    console.warn(`parseNumber(): could not parse "${input}" into a number`);
  }
  return n;
}
