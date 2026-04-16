import { create } from 'zustand';

export interface Thread {
  id: string;
  title: string;
  description?: string;
  estimatedScope: string;
  createdAt: string;
  updatedAt: string;
  completedStepsCount: number;
  totalStepsCount: number;
}

export interface CreateThreadData {
  title: string;
  description?: string;
  estimatedScope: string;
}

export interface UpdateThreadData {
  title?: string;
  description?: string;
  estimatedScope?: string;
}

export interface ThreadStore {
  threads: Thread[];
  currentThreadId: string | null;
  addThread: (data: CreateThreadData) => void;
  updateThread: (id: string, data: UpdateThreadData) => void;
  deleteThread: (id: string) => void;
  setCurrentThread: (id: string | null) => void;
  getThread: (id: string) => Thread | undefined;
}

export const useThreadStore = create<ThreadStore>((set, get) => ({
  threads: [],
  currentThreadId: null,

  addThread: (data: CreateThreadData) => {
    const newThread: Thread = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedStepsCount: 0,
      totalStepsCount: 0,
    };
    set((state) => ({
      threads: [...state.threads, newThread],
      currentThreadId: newThread.id,
    }));
  },

  updateThread: (id: string, data: UpdateThreadData) => {
    set((state) => ({
      threads: state.threads.map((thread) =>
        thread.id === id
          ? {
              ...thread,
              ...data,
              updatedAt: new Date().toISOString(),
            }
          : thread
      ),
    }));
  },

  deleteThread: (id: string) => {
    set((state) => ({
      threads: state.threads.filter((thread) => thread.id !== id),
      currentThreadId: state.currentThreadId === id ? null : state.currentThreadId,
    }));
  },

  setCurrentThread: (id: string | null) => {
    set({ currentThreadId: id });
  },

  getThread: (id: string) => {
    const { threads } = get();
    return threads.find((thread) => thread.id === id);
  },
}));