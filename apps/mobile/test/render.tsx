/**
 * Shared render helper for mobile screen tests.
 *
 * Wraps any component in the app's providers so screens don't crash due to
 * missing context.  Mirrors what RootLayout supplies at runtime.
 *
 * Usage:
 *   import { renderWithProviders } from '@/test/render';
 *   const screen = renderWithProviders(<FeedScreen />);
 *   // Then use the exported `screen` object from RNTL for queries:
 *   import { screen } from '@testing-library/react-native';
 *
 * The helper forwards all options to @testing-library/react-native's `render`
 * so you can pass `{ wrapper }`, `userEvent`, etc. as usual.
 */
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/** Minimal provider stack every screen needs. */
function AllProviders({ children }: { children: React.ReactNode }): ReactElement {
  return (
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 390, height: 844 },
        insets: { top: 47, left: 0, bottom: 34, right: 0 },
      }}>
      {children}
    </SafeAreaProvider>
  );
}

/**
 * Render a component with all app providers applied.
 *
 * @param ui      The React element to render.
 * @param options Standard RNTL render options.
 */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders, ...options });
}

export { screen, fireEvent, waitFor, act } from '@testing-library/react-native';
