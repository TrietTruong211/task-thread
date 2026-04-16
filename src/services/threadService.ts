import { useThreadStore } from '../stores/threadStore';

const STORAGE_KEY = 'task_thread_threads';

export interface CreateThreadRequest {
  title: string;
  description: string;
  estimatedScope: string;
}

export interface ThreadResponse {
  id: string;
  title: string;
  description: string;
  estimatedScope: string;
  createdAt: string;
  updatedAt: string;
  completedStepsCount: number;
  totalStepsCount: number;
}

export const threadService = {
  getAllThreads: (): ThreadResponse[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data).map((thread: ThreadResponse) => ({
        ...thread,
      }));
    } catch {
      return [];
    }
  },

  createThread: (data: CreateThreadRequest): ThreadResponse => {
    const newThread: ThreadResponse = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      estimatedScope: data.estimatedScope,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedStepsCount: 0,
      totalStepsCount: 0,
    };

    const existingThreads = threadService.getAllThreads();
    existingThreads.push(newThread);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingThreads));

    // Update the store
    const { addThread } = useThreadStore.getState();
    addThread({
      title: newThread.title,
      description: newThread.description,
      estimatedScope: newThread.estimatedScope,
    });

    return newThread;
  },

  updateThread: (id: string, partialData: Partial<CreateThreadRequest>): ThreadResponse | null => {
    try {
      const existingThreads = threadService.getAllThreads();
      const updatedThreads = existingThreads.map((thread) => {
        if (thread.id === id) {
          return {
            ...thread,
            title: partialData.title ?? thread.title,
            description: partialData.description ?? thread.description,
            estimatedScope: partialData.estimatedScope ?? thread.estimatedScope,
            updatedAt: new Date().toISOString(),
          };
        }
        return thread;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedThreads));

      // Update the store
      const { updateThread } = useThreadStore.getState();
      updateThread(id, partialData);

      return updatedThreads.find((t) => t.id === id) || null;
    } catch {
      return null;
    }
  },

  deleteThread: (id: string): boolean => {
    try {
      const existingThreads = threadService.getAllThreads();
      const filtered = existingThreads.filter((t) => t.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

      // Update the store
      const { deleteThread } = useThreadStore.getState();
      deleteThread(id);

      return true;
    } catch {
      return false;
    }
  },

  createEmptyThread: (): ThreadResponse => {
    const thread: ThreadResponse = {
      id: crypto.randomUUID(),
      title: '',
      description: '',
      estimatedScope: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedStepsCount: 0,
      totalStepsCount: 0,
    };

    const existingThreads = threadService.getAllThreads();
    existingThreads.push(thread);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingThreads));

    // Update the store
    const { addThread } = useThreadStore.getState();
    addThread({
      title: thread.title,
      description: thread.description,
      estimatedScope: thread.estimatedScope,
    });

    return thread;
  },
};