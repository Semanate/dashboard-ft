

/**
 * @description  Utility function to conditionally join class names.
 * @param classes 
 * @returns  A string of class names joined by spaces, filtering out falsy values.
 */

export function cn(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(' ');
}