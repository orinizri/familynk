/**
 * Capitalizes the first character of a string.
 * If the input is not a string or is empty, returns an empty string.
 *
 * @param {string} value – The input to transform.
 * @returns {string} The input with its first letter uppercased.
 */
export function capitalizeFirstLetter(value) {
  if (typeof value !== "string") {
    console.warn(
      `capitalizeFirstLetter(): expected a string but got ${typeof value}`
    );
    return "";
  }
  if (value.length === 0) return "";

  return value.charAt(0).toUpperCase() + value.slice(1);
}
