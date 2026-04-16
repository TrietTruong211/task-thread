import { useMemo } from 'react';
import { useThreadStore } from '../stores/threadStore';
import ThreadCard from './ThreadCard';
import { Thread } from '../stores/threadStore';

export const ThreadList = () => {
  const { threads, currentThreadId } = useThreadStore();

  const currentThread = useMemo(() => {
    return threads.find((t) => t.id === currentThreadId) || null;
  }, [threads, currentThreadId]);

  const otherThreads = useMemo(() => {
    return threads.filter((t) => t.id !== currentThreadId);
  }, [threads, currentThreadId]);

  return (
    <div className="thread-list">
      {threads.length === 0 ? (
        <div className="empty-state">
          <p>No threads yet. Create your first project thread!</p>
        </div>
      ) : (
        <>
          {currentThread && (
            <ThreadCard
              thread={currentThread}
              isActive={true}
              onSelect={() => {}}
            />
          )}
          {otherThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              isActive={false}
              onSelect={(e) => {
                e.stopPropagation();
                const { setCurrentThread } = useThreadStore.getState();
                setCurrentThread(thread.id);
              }}
              onDelete={(e) => {
                e.stopPropagation();
                const { deleteThread } = useThreadStore.getState();
                deleteThread(thread.id);
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};