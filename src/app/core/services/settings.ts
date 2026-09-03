import { Injectable, computed, effect, signal } from '@angular/core';

const API_KEY_STORAGE_KEY = 'ai-chat-studio.apiKey';
const MODEL_STORAGE_KEY = 'ai-chat-studio.model';

export interface AiModelOption {
  readonly id: string;
  readonly label: string;
  readonly description: string;
}

export const AVAILABLE_MODELS: readonly AiModelOption[] = [
  {
    id: 'claude-sonnet-4-5',
    label: 'Claude Sonnet 4.5',
    description: 'Balanced speed and intelligence — good default.',
  },
  {
    id: 'claude-opus-4-1',
    label: 'Claude Opus 4.1',
    description: 'Most capable, slower and more expensive.',
  },
  {
    id: 'claude-haiku-4-5',
    label: 'Claude Haiku 4.5',
    description: 'Fastest and cheapest, best for quick replies.',
  },
];

@Injectable({ providedIn: 'root' })
export class Settings {
  private readonly apiKeySignal = signal<string>(this.readFromStorage(API_KEY_STORAGE_KEY) ?? '');
  private readonly modelSignal = signal<string>(
    this.readFromStorage(MODEL_STORAGE_KEY) ?? AVAILABLE_MODELS[0]!.id,
  );

  readonly apiKey = this.apiKeySignal.asReadonly();
  readonly model = this.modelSignal.asReadonly();
  readonly hasApiKey = computed(() => this.apiKeySignal().trim().length > 0);

  constructor() {
    effect(() => this.writeToStorage(API_KEY_STORAGE_KEY, this.apiKeySignal()));
    effect(() => this.writeToStorage(MODEL_STORAGE_KEY, this.modelSignal()));
  }

  setApiKey(key: string): void {
    this.apiKeySignal.set(key.trim());
  }

  setModel(modelId: string): void {
    this.modelSignal.set(modelId);
  }

  clearApiKey(): void {
    this.apiKeySignal.set('');
  }

  private readFromStorage(key: string): string | null {
    if (typeof localStorage === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private writeToStorage(key: string, value: string): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage unavailable (private browsing, quota, etc.) — ignore.
    }
  }
}