/**
 * Manual mock for expo-haptics.
 *
 * All haptic functions are replaced with jest.fn() no-ops.
 * Tests that assert haptics were triggered can spy on these:
 *   expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
 */
const ImpactFeedbackStyle = {
  Light: 'light',
  Medium: 'medium',
  Heavy: 'heavy',
} as const;

const NotificationFeedbackType = {
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
} as const;

const impactAsync = jest.fn(async () => undefined);
const notificationAsync = jest.fn(async () => undefined);
const selectionAsync = jest.fn(async () => undefined);

module.exports = {
  ImpactFeedbackStyle,
  NotificationFeedbackType,
  impactAsync,
  notificationAsync,
  selectionAsync,
};
