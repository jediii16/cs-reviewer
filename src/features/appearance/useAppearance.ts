import { useEffect, useSyncExternalStore } from 'react';
import { useProgress } from '../progress/useProgress';
import type { AppearancePreference } from '../progress/storage';

export type ResolvedTheme = 'light' | 'dark';

const darkSchemeQuery = '(prefers-color-scheme: dark)';

function getMediaQuery() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
  return window.matchMedia(darkSchemeQuery);
}

function subscribeToSystemTheme(listener: () => void) {
  const media = getMediaQuery();
  if (!media) return () => undefined;

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }

  media.addListener(listener);
  return () => media.removeListener(listener);
}

function isSystemDark() {
  return getMediaQuery()?.matches ?? false;
}

function getServerTheme() {
  return false;
}

function applyTheme(theme: ResolvedTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  const themeColor = theme === 'dark' ? '#151518' : '#f5f4f1';
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.append(meta);
  }
  meta.content = themeColor;
}

export function useAppearance() {
  const { progress, setAppearance } = useProgress();
  const systemDark = useSyncExternalStore(subscribeToSystemTheme, isSystemDark, getServerTheme);
  const resolvedTheme: ResolvedTheme = progress.appearance === 'system'
    ? (systemDark ? 'dark' : 'light')
    : progress.appearance;

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  function selectAppearance(appearance: AppearancePreference) {
    setAppearance(appearance);
  }

  function toggleTheme() {
    setAppearance(resolvedTheme === 'dark' ? 'light' : 'dark');
  }

  return {
    appearance: progress.appearance,
    resolvedTheme,
    setAppearance: selectAppearance,
    toggleTheme,
  };
}
