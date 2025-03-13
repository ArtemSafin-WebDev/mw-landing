export const isTouch = () =>
  !window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/**
 * Gets the duration of a video element and returns both seconds and formatted time.
 * @param {HTMLVideoElement} videoElement - The video element to get duration from
 * @param {number} [timeout=10000] - Timeout in milliseconds to wait for metadata to load
 * @returns {Promise<{seconds: number, formatted: string}>} Object containing duration in seconds and formatted time
 */
function getVideoDuration(
  videoElement: HTMLVideoElement,
  timeout: number = 10000
): Promise<{ seconds: number; formatted: string }> {
  return new Promise((resolve, reject) => {
    // Check if valid video element
    if (!videoElement || !(videoElement instanceof HTMLVideoElement)) {
      reject(new Error("Invalid video element provided"));
      return;
    }

    // Format duration in seconds to hh:mm:ss
    const formatDuration = (seconds: number) => {
      if (isNaN(seconds) || !isFinite(seconds)) return "00:00:00";

      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);

      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Set timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      reject(new Error("Timeout waiting for video metadata to load"));
    }, timeout);

    // Check if metadata is already loaded
    if (videoElement.readyState >= 1 && !isNaN(videoElement.duration)) {
      clearTimeout(timeoutId);
      resolve({
        seconds: videoElement.duration,
        formatted: formatDuration(videoElement.duration),
      });
      return;
    }

    // Wait for metadata to load
    const metadataHandler = () => {
      clearTimeout(timeoutId);

      if (isNaN(videoElement.duration)) {
        reject(new Error("Could not determine video duration"));
        return;
      }

      resolve({
        seconds: videoElement.duration,
        formatted: formatDuration(videoElement.duration),
      });
    };

    videoElement.addEventListener("loadedmetadata", metadataHandler);

    // Handle errors
    videoElement.addEventListener(
      "error",
      () => {
        clearTimeout(timeoutId);
        reject(new Error("Error loading video metadata"));
      },
      { once: true }
    );
  });
}

export { getVideoDuration };
