import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

// Get initial theme from localStorage or default to 'light'
function getInitialTheme(): Theme {
    if (!browser) return 'light';
    
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored && ['light', 'dark'].includes(stored)) {
        return stored;
    }
    return 'light';
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
                const newTheme: Theme = current === 'dark' ? 'light' : 'dark';
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
            }
        }
    };
}

function applyTheme(theme: Theme) {
    if (!browser) return;
    
    const root = document.documentElement;
    
    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

export const themeStore = createThemeStore();
