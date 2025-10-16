/**
 * Environment utilities for handling development-specific configurations
 * and browser extension compatibility
 */

export const isDevelopment = process.env.NODE_ENV === "development";
export const isProduction = process.env.NODE_ENV === "production";
export const isTest = process.env.NODE_ENV === "test";

/**
 * Check if we're running in a browser environment
 */
export const isBrowser = typeof window !== "undefined";

/**
 * Check if we're running on the server
 */
export const isServer = typeof window === "undefined";

/**
 * Detect if browser extensions might be interfering
 * This is a common cause of hydration mismatches
 */
export const hasBrowserExtensions = (): boolean => {
  if (!isBrowser) return false;

  // Check for common browser extension attributes
  const body = document.body;
  const hasExtensionAttributes =
    body.hasAttribute("data-extension-id") ||
    body.hasAttribute("data-channel-name") ||
    body.hasAttribute("cz-shortcut-listen") ||
    body.hasAttribute("data-new-gr-c-s-check-loaded");

  return hasExtensionAttributes;
};

/**
 * Environment configuration for Flow network
 */
export const flowNetwork = process.env.NEXT_PUBLIC_FLOW_NETWORK || "emulator";
export const isEmulator = flowNetwork === "emulator";
export const isTestnet = flowNetwork === "testnet";
export const isMainnet = flowNetwork === "mainnet";

/**
 * Development helpers
 */
export const debugMode =
  isDevelopment && process.env.NEXT_PUBLIC_DEBUG === "true";

/**
 * Safe console logging that only works in development
 */
export const devLog = (...args: unknown[]) => {
  if (isDevelopment && isBrowser) {
    console.log("[SmartLend Dev]", ...args);
  }
};

/**
 * Safe console warning that only works in development
 */
export const devWarn = (...args: unknown[]) => {
  if (isDevelopment && isBrowser) {
    console.warn("[SmartLend Dev]", ...args);
  }
};

/**
 * Safe console error logging
 */
export const devError = (...args: unknown[]) => {
  if (isDevelopment && isBrowser) {
    console.error("[SmartLend Dev]", ...args);
  }
};

/**
 * Suppress hydration warnings in development when browser extensions
 * are detected (they commonly cause hydration mismatches)
 */
export const shouldSuppressHydrationWarning = (): boolean => {
  return isDevelopment && hasBrowserExtensions();
};

/**
 * Get environment-specific configuration
 */
export const getEnvironmentConfig = () => ({
  isDevelopment,
  isProduction,
  isTest,
  isBrowser,
  isServer,
  flowNetwork,
  isEmulator,
  isTestnet,
  isMainnet,
  debugMode,
  hasBrowserExtensions: isBrowser ? hasBrowserExtensions() : false,
});

/**
 * Runtime environment checks
 */
export const runtimeChecks = {
  /**
   * Check if FCL can be safely initialized
   */
  canInitializeFCL: (): boolean => {
    return (
      isBrowser &&
      typeof (window as typeof window & { fcl?: unknown }).fcl === "undefined"
    );
  },

  /**
   * Check if wallet connection is available
   */
  canConnectWallet: (): boolean => {
    return isBrowser && "serviceWorker" in navigator;
  },

  /**
   * Check if local storage is available
   */
  hasLocalStorage: (): boolean => {
    try {
      return isBrowser && typeof localStorage !== "undefined";
    } catch {
      return false;
    }
  },

  /**
   * Check if session storage is available
   */
  hasSessionStorage: (): boolean => {
    try {
      return isBrowser && typeof sessionStorage !== "undefined";
    } catch {
      return false;
    }
  },
};

const environmentUtils = {
  isDevelopment,
  isProduction,
  isTest,
  isBrowser,
  isServer,
  detectBrowserExtensions,
  flowNetwork,
  isEmulator,
  isTestnet,
  isMainnet,
  debugMode,
  devLog,
  devWarn,
  devError,
  compatibility,
};

export default environmentUtils;
