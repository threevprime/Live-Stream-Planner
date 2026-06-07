export type StreamStatus = "planned" | "live" | "completed" | "cancelled";

export interface Stream {
    id: string;
    title: string;
    startTime: string;
    durationMinutes: number;
    game: string;
    description: string;
    status: StreamStatus;
    createdAt: string;
}

export type RepeatInterval = "none" | "daily" | "weekly" | "custom";

export interface Reminder {
    id: string;
    title: string;
    dueAt: string;
    description: string;
    repeat: RepeatInterval;
    repeatDays?: number;
    done: boolean;
    createdAt: string;
}

export interface Settings {
    streamerName: string;
    twitchUsername: string;
    timezone: string;
    defaultDuration: number;
    discordMessageTemplate: string;
}
