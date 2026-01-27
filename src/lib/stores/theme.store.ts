import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark' | 'system';

// Get initial theme from localStorage or default to 'system'
function getInitialTheme(): Theme {
    if (!browser) return 'light';
    
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored;
    }
    return 'system';
}

// Get the actual theme (resolves 'system' to 'light' or 'dark')
function getResolvedTheme(theme: Theme): 'light' | 'dark' {
    if (theme === 'system') {
        if (!browser) return 'light';
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme;
}

function createThemeStore() {
    const { subscribe, set, update } = writable<Theme>(getInitialTheme());
    
    return {
        subscribe,
        set: (theme: Theme) => {
            if (browser) {
                localStorage.setItem('theme', theme);
                applyTheme(theme);
            }
            set(theme);
        },
        toggle: () => {
            update(current => {
                const resolved = getResolvedTheme(current);
                const newTheme: Theme = resolved === 'dark' ? 'light' : 'dark';
                if (browser) {
                    localStorage.setItem('theme', newTheme);
                    applyTheme(newTheme);
                }
                return newTheme;
            });
        },
        init: () => {
            if (browser) {
                const theme = getInitialTheme();
                applyTheme(theme);
                
                // Listen for system theme changes
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                    const currentTheme = localStorage.getItem('theme') as Theme;
                    if (currentTheme === 'system') {
                        applyTheme('system');
                    }
                });
            }
        }
    };
}

function applyTheme(theme: Theme) {
    if (!browser) return;
    
    const resolved = getResolvedTheme(theme);
    const root = document.documentElement;
    
    if (resolved === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

export const themeStore = createThemeStore();

// Derived store for the resolved theme (light or dark)
export function getResolvedThemeValue(theme: Theme): 'light' | 'dark' {
    return getResolvedTheme(theme);
}
