import { useCallback, useEffect, useState } from 'react';

export type Page = 'home' | 'editor' | 'finish' | 'gallery';
const paths: Record<Page, string> = {
  home: '/',
  editor: '/setup',
  finish: '/setup/preview',
  gallery: '/gallery',
};
const readPage = (): Page =>
  location.pathname.replace(/\/$/, '') === '/gallery'
    ? 'gallery'
    : location.pathname.replace(/\/$/, '') === '/setup/preview'
      ? 'finish'
      : location.pathname.replace(/\/$/, '') === '/setup'
        ? 'editor'
        : 'home';
export function usePage() {
  const [page, setPage] = useState<Page>(readPage);
  useEffect(() => {
    const pop = () => {
      setPage(readPage());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  const navigate = useCallback((next: Page, replace = false) => {
    if (location.pathname !== paths[next]) {
      if (replace) history.replaceState(null, '', paths[next]);
      else history.pushState(null, '', paths[next]);
    }
    setPage(next);
  }, []);
  return [page, navigate] as const;
}
