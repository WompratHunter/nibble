/**
 * Manual mock for expo-image-picker.
 *
 * Returns a cancelled result by default. Override in individual tests:
 *   (launchCameraAsync as jest.Mock).mockResolvedValueOnce({
 *     canceled: false,
 *     assets: [{ uri: 'file://video.mp4', duration: 30000 }],
 *   });
 */
const MediaType = {
  Images: 'images',
  Videos: 'videos',
  All: 'all',
} as const;

const launchCameraAsync = jest.fn(async () => ({ canceled: true, assets: [] }));
const launchImageLibraryAsync = jest.fn(async () => ({ canceled: true, assets: [] }));
const requestCameraPermissionsAsync = jest.fn(async () => ({
  granted: true,
  status: 'granted',
}));
const requestMediaLibraryPermissionsAsync = jest.fn(async () => ({
  granted: true,
  status: 'granted',
}));
const getCameraPermissionsAsync = jest.fn(async () => ({
  granted: true,
  status: 'granted',
}));
const getMediaLibraryPermissionsAsync = jest.fn(async () => ({
  granted: true,
  status: 'granted',
}));

module.exports = {
  MediaType,
  launchCameraAsync,
  launchImageLibraryAsync,
  requestCameraPermissionsAsync,
  requestMediaLibraryPermissionsAsync,
  getCameraPermissionsAsync,
  getMediaLibraryPermissionsAsync,
};
