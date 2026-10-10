/**
 * Manual mock for expo-av.
 *
 * expo-av relies on native modules unavailable in Jest. This mock provides
 * minimal stubs so screens that still use expo-av can be rendered in tests
 * without crashing.  This mock will be removed when the expo-video migration
 * ticket (expo-av replacement) is complete.
 *
 * The Video component is replaced with a plain RN View so RNTL can render it.
 */
import React from 'react';
import { View, ViewProps } from 'react-native';

const ResizeMode = {
  CONTAIN: 'contain',
  COVER: 'cover',
  STRETCH: 'stretch',
} as const;

/** Minimal Video stub rendered as an accessible View. */
function Video(props: ViewProps & Record<string, unknown>) {
  // Forward the testID so tests can locate the player if needed.
  return React.createElement(View, {
    testID: (props.testID as string | undefined) ?? 'video-player',
    accessibilityRole: 'none',
  } satisfies ViewProps);
}
Video.displayName = 'Video';

module.exports = {
  Video,
  ResizeMode,
  Audio: {
    setAudioModeAsync: jest.fn(async () => undefined),
  },
};
