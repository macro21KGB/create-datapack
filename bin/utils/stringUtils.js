
/**
 * If the value is a file path with an extension, it will trim the extension
 * Example:
 *  path.js -> path
 *  
 * mycode.sh -> mycode
 * @param {string} value 
 */
export const trimExtensionFromFile = (value) => {
    if (!value.includes("."))
        return value;

    return value.substring(0, value.indexOf("."));
}