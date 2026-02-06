import { notificationState, type Notification, type NotificationStatus } from "$lib/stores/notifications.svelte";
import type { SupabaseClient } from "@supabase/supabase-js";
import { notificationSoundService } from "./notification-sound.service";

/**
 * Service to handle notification logic
 */
export class NotificationService {
    private static instance: NotificationService;
    private supabase: SupabaseClient | null = null;
    private userId: string | null = null;
    private channel: any = null;

    private constructor() { }

    public static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    /**
     * Starts checking for pending forms/notifications via Supabase Realtime
     */
    public async init(supabase: SupabaseClient, userId: string) {
        if (this.supabase) return;

        this.supabase = supabase;
        this.userId = userId;


        // 1. Load initial history - Let RLS handle filtering
        // RLS will automatically filter based on user role and permissions
        const { data, error } = await this.supabase
            .from('notifications')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);



        if (!error && data) {
            const notifications: Notification[] = data.map(d => ({
                id: d.id,
                message: d.message,
                status: d.status as NotificationStatus,
                timestamp: new Date(d.created_at),
                read: d.status !== 'pending',
                form_id: d.form_id,
                user_id: d.user_id,
                type: 'info'
            }));
            notificationState.setHistory(notifications);
        }

        this.channel = this.supabase.channel('notifications-realtime')
            .on('postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications'
                },
                (payload) => {
                    const d = payload.new;
                    const notif: Notification = {
                        id: d.id,
                        message: d.message,
                        status: d.status as NotificationStatus,
                        timestamp: new Date(d.created_at),
                        read: false,
                        form_id: d.form_id,
                        user_id: d.user_id,
                        type: 'info'
                    };
                    notificationState.prepend(notif);

                    // Play notification sound (throttled automatically)
                    notificationSoundService.play();

                    // Show toast
                    this.notifyToast(notif.message, 'info');
                }
            )
            .subscribe((status) => {
                console.log('Realtime status:', status);
            });
    }

    public stop() {
        if (this.supabase && this.channel) {
            this.supabase.removeChannel(this.channel);
            this.channel = null;
        }
    }

    /**
     * Manually add a toast (e.g. success message)
     */
    public notifyToast(message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info') {
        notificationState.addToast({
            message,
            type,
            duration: 5000
        });
    }

    public async markAsRead(id: string) {
        // Optimistic update
        notificationState.markAsRead(id);

        if (this.supabase) {
            await this.supabase
                .from('notifications')
                .update({ status: 'read' })
                .eq('id', id);
        }
    }

    public async markAllAsRead() {
        notificationState.markAllAsRead();
        if (this.supabase && this.userId) {
            await this.supabase
                .from('notifications')
                .update({ status: 'read' })
                .eq('status', 'pending');
        }
    }
}

export const notificationService = NotificationService.getInstance();
