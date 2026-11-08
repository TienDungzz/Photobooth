try {
  const preferences = JSON.parse(localStorage.getItem('photobooth.preferences.v1') || '{}');
  const choice = preferences.version === 1 ? preferences.themePreference : 'system';
  const dark = choice === 'dark' || (choice !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
} catch {
  document.documentElement.dataset.theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
