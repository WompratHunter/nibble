/**
 * Manual mock for expo-video.
 *
 * Prevents native module errors in Jest by replacing the video player with
 * a no-op stub. Later tickets that test video playback should extend this mock
 * via jest.mock('expo-video', () => ({ ...require('expo-video'), ... })).
 */
const VideoView = 'VideoView';

const useVideoPlayer = jest.fn(() => ({
  play: jest.fn(),
  pause: jest.fn(),
  replace: jest.fn(),
  currentTime: 0,
  status: 'idle',
}));

module.exports = {
  VideoView,
  useVideoPlayer,
};
