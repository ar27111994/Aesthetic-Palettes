/**
 * Copies the given text to the user's clipboard.
 *
 * @param text The text to copy.
 * @returns A promise that resolves when the text is copied, or rejects on error.
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  if (!navigator.clipboard) {
    // Fallback for older browsers or insecure contexts (http)
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Prevent scrolling to bottom
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.position = "fixed";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (!successful) {
        throw new Error("Fallback copy command failed");
      }
      return Promise.resolve();
    } catch (err) {
      console.error("Fallback: Oops, unable to copy", err);
      return Promise.reject(new Error("Could not copy text"));
    }
  }

  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Async: Could not copy text: ", err);
    return Promise.reject(new Error("Could not copy text"));
  }
};
