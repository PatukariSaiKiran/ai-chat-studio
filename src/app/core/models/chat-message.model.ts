export type ChatRole = 'user' | 'assistant';

export type ChatMessageStatus = 'complete' | 'streming' | 'error';

export interface ChatMessage {
    readonly id: string;
    readonly role: ChatRole;
    readonly createAt: number;
    content: string;
    status: ChatMessageStatus;
    errorMessage?: string;
}