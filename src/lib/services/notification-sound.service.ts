/**
 * Service to handle notification sound playback with throttling
 * Prevents multiple sounds from playing simultaneously
 */
export class NotificationSoundService {
    private static instance: NotificationSoundService;
    private audio: HTMLAudioElement | null = null;
    private isPlaying: boolean = false;
    private queue: number = 0;
    private lastPlayTime: number = 0;
    private readonly MIN_INTERVAL = 1500; // Minimum 1.5s between sounds
    private soundPath: string = '/sounds/notification.mp3';

    private constructor() {
        if (typeof window !== 'undefined') {
            this.initAudio();
        }
    }

    public static getInstance(): NotificationSoundService {
        if (!NotificationSoundService.instance) {
            NotificationSoundService.instance = new NotificationSoundService();
        }
        return NotificationSoundService.instance;
    }

    private initAudio() {
        try {
            this.audio = new Audio(this.soundPath);
            this.audio.volume = 0.6; // 60% volume
            this.audio.preload = 'auto';

            this.audio.addEventListener('ended', () => {
                this.isPlaying = false;
                this.processQueue();
            });

            this.audio.addEventListener('error', (e) => {
                console.warn('Notification sound failed to load:', e);
                this.isPlaying = false;
            });
        } catch (error) {
            console.warn('Could not initialize notification audio:', error);
        }
    }

    /**
     * Play notification sound with throttling
     * If multiple notifications arrive, they are queued
     */
    public play() {
        if (!this.audio) {
            return;
        }

        const now = Date.now();
        const timeSinceLastPlay = now - this.lastPlayTime;

        if (this.isPlaying || timeSinceLastPlay < this.MIN_INTERVAL) {
            this.queue++;

            if (!this.isPlaying) {
                const delay = this.MIN_INTERVAL - timeSinceLastPlay;
                setTimeout(() => this.processQueue(), delay);
            }
            return;
        }

        this.playSound();
    }

    private playSound() {
        if (!this.audio || this.isPlaying) {
            return;
        }

        this.isPlaying = true;
        this.lastPlayTime = Date.now();

        this.audio.currentTime = 0;

        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                console.warn('Audio playback failed:', error);
                this.isPlaying = false;
                this.processQueue();
            });
        }
    }

    private processQueue() {
        if (this.queue > 0) {
            this.queue--;

            const now = Date.now();
            const timeSinceLastPlay = now - this.lastPlayTime;

            if (timeSinceLastPlay >= this.MIN_INTERVAL) {
                this.playSound();
            } else {
                const delay = this.MIN_INTERVAL - timeSinceLastPlay;
                setTimeout(() => this.playSound(), delay);
            }
        }
    }

    /**
     * Set custom sound path
     */
    public setSoundPath(path: string) {
        this.soundPath = path;
        if (this.audio && typeof window !== 'undefined') {
            this.initAudio();
        }
    }

    /**
     * Set volume (0.0 to 1.0)
     */
    public setVolume(volume: number) {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, volume));
        }
    }

    /**
     * Clear the queue (useful for testing or reset)
     */
    public clearQueue() {
        this.queue = 0;
    }

    /**
     * Get current queue size
     */
    public getQueueSize(): number {
        return this.queue;
    }
}

export const notificationSoundService = NotificationSoundService.getInstance();
