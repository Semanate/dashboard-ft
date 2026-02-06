import { browser } from '$app/environment';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';
export type NotificationStatus = 'pending' | 'read' | 'approved' | 'archived';

export interface Notification {
    id: string; // UUID from DB
    form_id?: string;
    user_id?: string;
    type: NotificationType; // Derived or stored? DB has minimal schema. We can infer type or add it to DB. For now, assume 'info' or infer from message.
    message: string;
    title?: string;
    status: NotificationStatus;
    timestamp: Date;
    read: boolean; // Derived helper or kept for compat
    link?: string;
    // UI specific
    duration?: number;
}

class NotificationState {
    // Active toasts (ephemeral - success messages etc)
    toasts = $state<Notification[]>([]);

    // Complete history (persistent from DB)
    history = $state<Notification[]>([]);

    unreadCount = $derived(this.history.filter(n => n.status === 'pending').length);

    constructor() { }

    // Method to hydration from DB
    setHistory(notifications: Notification[]) {
        this.history = notifications;
    }

    addToast(notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'status'>) {
        const id = crypto.randomUUID();
        const newNotification: Notification = {
            ...notification,
            id,
            timestamp: new Date(),
            status: 'pending',
            read: false,
        };

        this.toasts.push(newNotification);

        if (notification.duration !== 0) {
            const duration = notification.duration || 5000;
            setTimeout(() => {
                this.dismissToast(id);
            }, duration);
        }
    }

    // Called by Realtime subscription
    prepend(notification: Notification) {
        // Prevent duplicates
        if (!this.history.some(n => n.id === notification.id)) {
            this.history = [notification, ...this.history];
        }
    }

    updateStatus(id: string, status: NotificationStatus) {
        const notification = this.history.find(n => n.id === id);
        if (notification) {
            notification.status = status;
            notification.read = (status === 'read' || status === 'approved' || status === 'archived');
        }
    }

    dismissToast(id: string) {
        this.toasts = this.toasts.filter(n => n.id !== id);
    }

    // Legacy helper adaptation
    markAsRead(id: string) {
        this.updateStatus(id, 'read');
    }

    markAllAsRead() {
        this.history.forEach(n => {
            if (n.status === 'pending') {
                n.status = 'read';
                n.read = true;
            }
        });
    }

    // Compatibility aliases
    add(context: any) {
        this.addToast(context);
    }

    remove(id: string) {
        this.dismissToast(id);
    }

    clearHistory() {
        this.history = [];
    }
}

export const notificationState = new NotificationState();
