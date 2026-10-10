/**
 * Global test setup for the mobile project.
 *
 * Loaded via jest.config.js `setupFilesAfterEnv`. Registers RNTL's custom
 * matchers and mocks the native Share API so all tests can import it
 * without crashing.
 */
import '@testing-library/react-native/matchers';
import { Share } from 'react-native';

// Mock RN Share so tests can assert on share calls without hitting native code.
// Usage in tests:
//   jest.spyOn(Share, 'share').mockResolvedValueOnce({ action: Share.sharedAction });
jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction });
