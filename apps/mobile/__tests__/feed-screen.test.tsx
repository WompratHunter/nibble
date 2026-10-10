/**
 * Smoke test for FeedScreen.
 *
 * Exercises the screen at the screen/hook level using RNTL and accessibility
 * queries to verify the test harness is wired up correctly.  See
 * `test/render.tsx` and `test/fetch-mock.ts` for shared helpers.
 *
 * These tests assert on observable, accessible output — not component state or
 * implementation details — so they survive internal refactors safely.
 */
import React from 'react';
import { act, screen, waitFor } from '@testing-library/react-native';

import FeedScreen from '@/app/features/feed';
import { renderWithProviders } from '@/test/render';
import { fetchFeed } from '@/services/feed-service';

// ─── Navigation mocks ──────────────────────────────────────────────────────
// FeedScreen calls useBottomTabBarHeight which requires a tab navigator context.
// Mock it to return a fixed tab bar height so the screen can render standalone.
jest.mock('@react-navigation/bottom-tabs', () => ({
  ...jest.requireActual('@react-navigation/bottom-tabs'),
  useBottomTabBarHeight: () => 83,
}));

// useIsFocused returns true so the feed behaves as if the tab is active.
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useIsFocused: () => true,
}));

// ─── Feed service mock ──────────────────────────────────────────────────────
jest.mock('@/services/feed-service');
const mockedFetchFeed = fetchFeed as jest.MockedFunction<typeof fetchFeed>;

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('FeedScreen', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a loading indicator while the feed is fetching', async () => {
    // Keep the promise pending so the screen stays in the loading state.
    mockedFetchFeed.mockReturnValue(new Promise(() => {}));

    await act(async () => {
      renderWithProviders(<FeedScreen />);
    });

    // ActivityIndicator has role "progressbar" in RNTL.
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });

  it('renders an error message when the feed fails to load', async () => {
    mockedFetchFeed.mockRejectedValue(new Error('Failed to load feed'));

    await act(async () => {
      renderWithProviders(<FeedScreen />);
    });

    // Wait for the rejected promise to update state and render the error text.
    await waitFor(() => {
      expect(screen.getByText('Failed to load feed')).toBeTruthy();
    });
  });

  it('renders feed item titles after successful load', async () => {
    mockedFetchFeed.mockResolvedValue([
      {
        id: 1,
        title: 'Scrambled Eggs',
        description: 'Quick and fluffy.',
        thumbnailUrl: undefined,
        videoSource: { uri: 'https://example.com/video.mp4' },
      },
    ]);

    await act(async () => {
      renderWithProviders(<FeedScreen />);
    });

    await waitFor(() => {
      expect(screen.getByText('Scrambled Eggs')).toBeTruthy();
    });
  });
});
