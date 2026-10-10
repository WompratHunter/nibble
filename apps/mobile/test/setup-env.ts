/**
 * Pre-test environment setup (runs BEFORE jest installs mocks).
 *
 * Eagerly accesses all lazy globals that Expo's winter runtime installs so
 * they are resolved inside the module-loading scope.  Without this, their
 * getters fire after a test ends (during async cleanup), which triggers a
 * jest-runtime "outside test code scope" ReferenceError on React Native +
 * Expo 54.
 */

// Force all lazy Expo winter getters to resolve while we're still inside
// the module-load scope.  The globals are defined in:
// node_modules/expo/src/winter/runtime.native.ts
const g = global as Record<string, unknown>;

// Each access triggers the lazy initialiser once; subsequent accesses skip it.
void g.__ExpoImportMetaRegistry;
void g.structuredClone;
void g.TextDecoder;
void g.TextDecoderStream;
void g.TextEncoderStream;
void g.URL;
void g.URLSearchParams;
