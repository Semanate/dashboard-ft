import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

class ThemeState {
    current = $state<Theme>('light');

    constructor() {
        if (browser) {
            const stored = localStorage.getItem('theme') as Theme | null;
            if (stored && ['light', 'dark'].includes(stored)) {
                this.current = stored;
            }
            this.apply(this.current);
        }
    }

    set(theme: Theme) {
        this.current = theme;
        if (browser) {
            localStorage.setItem('theme', theme);
            this.apply(theme);
        }
    }

    toggle() {
        const newTheme = this.current === 'dark' ? 'light' : 'dark';
        this.set(newTheme);
    }

    init() {
        if (browser) {
            this.apply(this.current);
        }
    }

    private apply(theme: Theme) {
        if (!browser) return;
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }
}

export const themeState = new ThemeState();
