"use client";

import { useEffect, useState } from 'react';

/**
 * Custom hook to handle hydration-safe rendering
 * This prevents hydration mismatches by ensuring components only render after hydration
 */
export function useHydrationSafe() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This effect only runs on the client after hydration
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * Hook to safely check if we're on the client side
 * Useful for components that need browser APIs
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

/**
 * Hook to detect browser extensions that might cause hydration issues
 * Returns true if extensions are detected that commonly modify the DOM
 */
export function useBrowserExtensionDetection() {
  const [hasExtensions, setHasExtensions] = useState(false);
  const isClient = useIsClient();

  useEffect(() => {
    if (!isClient) return;

    // Check for common browser extension attributes that cause hydration issues
    const checkForExtensions = () => {
      const body = document.body;
      const commonExtensionAttributes = [
        'data-extension-id',
        'data-channel-name',
        'cz-shortcut-listen',
        'data-new-gr-c-s-check-loaded',
        'data-gr-c-s-loaded',
        'spellcheck',
        'data-lastpass-icon-root',
        'data-1p-ignore',
        'data-bitwarden-watching'
      ];

      const hasExtensionAttributes = commonExtensionAttributes.some(attr =>
        body.hasAttribute(attr)
      );

      setHasExtensions(hasExtensionAttributes);
    };

    // Check immediately
    checkForExtensions();

    // Also check after a short delay in case extensions inject attributes later
    const timeout = setTimeout(checkForExtensions, 100);

    return () => clearTimeout(timeout);
  }, [isClient]);

  return hasExtensions;
}

/**
 * Hook to safely access window object with hydration safety
 */
export function useSafeWindow() {
  const isClient = useIsClient();
  return isClient ? window : undefined;
}

/**
 * Hook to safely access localStorage with error handling
 */
export function useSafeLocalStorage() {
  const isClient = useIsClient();

  const getItem = (key: string): string | null => {
    if (!isClient) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };

  const setItem = (key: string, value: string): boolean => {
    if (!isClient) return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  };

  const removeItem = (key: string): boolean => {
    if (!isClient) return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  };

  return { getItem, setItem, removeItem, isAvailable: isClient };
}

/**
 * Hook to handle component mounting with hydration safety
 * Useful for components that need to render differently on server vs client
 */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

/**
 * Hook to suppress hydration warnings in development when browser extensions are detected
 */
export function useHydrationWarningSuppress() {
  const hasExtensions = useBrowserExtensionDetection();
  const isDevelopment = process.env.NODE_ENV === 'development';

  return isDevelopment && hasExtensions;
}

export default useHydrationSafe;
