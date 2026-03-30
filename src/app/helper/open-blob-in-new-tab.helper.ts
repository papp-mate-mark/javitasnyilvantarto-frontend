/**
 * Opens a Blob in a new browser tab using a temporary object URL.
 */
export function openBlobInNewTab(blob: Blob): void {
  const fileURL = URL.createObjectURL(blob);
  window.open(fileURL, '_blank');
}
