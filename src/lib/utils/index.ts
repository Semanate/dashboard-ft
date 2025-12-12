

/**
 * @description  Utility function to conditionally join class names.
 * @param classes 
 * @returns  A string of class names joined by spaces, filtering out falsy values.
 */

export function cn(...classes: Array<string | false | null | undefined>): string {
    return classes.filter(Boolean).join(' ');
}

export function timeAgo(date: string | Date) {
    const now = new Date();
    const past = new Date(date);
    const diff = (past.getTime() - now.getTime()) / 1000;

    const rtf = new Intl.RelativeTimeFormat('es-CO', {
        numeric: 'auto'
    });

    const units: [number, Intl.RelativeTimeFormatUnit][] = [
        [60, 'second'],
        [60, 'minute'],
        [24, 'hour'],
        [7, 'day'],
        [4.34524, 'week'],
        [12, 'month'],
        [Number.POSITIVE_INFINITY, 'year']
    ];

    let duration = diff;

    for (const [amount, unit] of units) {
        if (Math.abs(duration) < amount) {
            return rtf.format(Math.round(duration), unit);
        }
        duration /= amount;
    }
}
