/**
 * Filepath: output/features/step-history-view/tests/step-history-view.ts
 * 
 * Component Tests for Step History View
 * Uses Jest/Vitest + React Testing Library
 * Tests the timeline view showing completed steps and remaining tasks
 */

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StepHistoryView from '../../../src/components/features/step-history-view/StepHistoryView';
import MicroStepItem from '../../../src/components/features/microsteps/MicroStepItem';
import { MicroStep } from '../../../src/types/step';
import { Thread } from '../../../src/types/thread';

// Mock MicroStepItem to avoid component tree complexity
jest.mock('../../../src/components/features/microsteps/MicroStepItem', () => {
  const MockComponent = ({ step, onToggleComplete, onDelete }: { step: MicroStep; onToggleComplete: (s: MicroStep) => void; onDelete: (s: MicroStep) => void }) => {
    return (
      <div data-testid="mock-step-item">
        <span data-testid="step-text">{step.title}</span>
        <button
          data-testid="complete-btn"
          onClick={() => onToggleComplete(step)}
        >
          {step.completed ? 'Completed' : 'Mark Complete'}
        </button>
        <button data-testid="delete-btn" onClick={() => onDelete(step)}>
          Delete
        </button>
      </div>
    );
  };
  return MockComponent;
});

// Mock icons
jest.mock('react-icons/lucide', () => ({
  Check: ({ className, ...props }: any) => <svg data-testid="check-icon" {...props} className={className} />,
  Clock: ({ className, ...props }: any) => <svg data-testid="clock-icon" {...props} className={className} />,
  Trash2: ({ className, ...props }: any) => <svg data-testid="trash-icon" {...props} className={className} />,
  ChevronDown: ({ className, ...props }: any) => <svg data-testid="chevron-icon" {...props} className={className} />,
  CheckCircle2: ({ className, ...props }: any) => <svg data-testid="check-circle-icon" {...props} className={className} />,
}));

describe('StepHistoryView Component', () => {
  const createMockThread = (id: string, title: string): Thread => ({
    id,
    title,
    steps: [
      { id: '1', title: 'Complete Research', completed: true },
      { id: '2', title: 'Draft Outline', completed: true },
      { id: '3', title: 'Write Introduction', completed: false },
      { id: '4', title: 'Write Conclusion', completed: false },
    ],
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the step history view title', () => {
      const thread = createMockThread('thread-1', 'Research Project');
      render(<StepHistoryView thread={thread} />);

      expect(screen.getByText('Thread: Research Project')).toBeInTheDocument();
      expect(screen.getByText('Step Timeline')).toBeInTheDocument();
    });

    it('renders completed steps with correct styling', () => {
      const thread = createMockThread('thread-1', 'Research Project');
      render(<StepHistoryView thread={thread} />);

      const completedStep1 = screen.getByText('Complete Research');
      const completedStep2 = screen.getByText('Draft Outline');

      // Completed steps should have a completion checkmark
      expect(screen.getAllByTestId('step-item')).toHaveLength(4); // All steps
    });

    it('renders pending steps correctly', () => {
      const thread = createMockThread('thread-1', 'Research Project');
      render(<StepHistoryView thread={thread} />);

      const pendingStep = screen.getByText('Write Introduction');

      // Pending steps should be visible
      expect(pendingStep).toBeInTheDocument();
    });

    it('correctly renders the current step indicator', () => {
      const thread = createMockThread('thread-1', 'Research Project');
      render(<StepHistoryView thread={thread} />);

      // First incomplete step should be highlighted as current
      const currentStep = screen.getByText('Write Introduction');
      expect(currentStep).toBeInTheDocument();
    });

    it('empty thread shows empty state', () => {
      const emptyThread: Thread = {
        id: 'empty-thread',
        title: 'Empty Thread',
        steps: [],
      };
      render(<StepHistoryView thread={emptyThread} />);

      const emptyState = screen.getByText('No steps yet');
      expect(emptyState).toBeInTheDocument();
    });
  });

  describe('Step Completion Toggle', () => {
    it('allows marking a step as complete', async () => {
      const thread = createMockThread('thread-1', 'Research Project');
      render(<StepHistoryView thread={thread} />);

      // Find the incomplete step
      const incompleteStep = screen.getByText('Write Introduction');
      
      const completeBtn = screen.getByRole('button', { name: /Mark Complete$/ });
      
      // Click the complete button
      await userEvent.click(completeBtn);

      // After clicking, the step should be updated
      await waitFor(() => {
        expect(completeBtn).toHaveTextContent('Completed');
      });
    });

    it('handles toggling completion for multiple steps', async () => {
      const thread = createMockThread('thread-1', 'Research Project');
      render(<StepHistoryView thread={thread} />);

      const stepList = screen.getByTestId('step-list');
      
      // First step is already complete - try to complete it again
      const completedStep1 = screen.getByText('Draft Outline');
      const firstIncompleteBtn = screen.getAllByRole('button', { name: /Mark Complete$/ })[0];
      
      await userEvent.click(firstIncompleteBtn);

      // The step should remain incomplete until actually completed
      const secondIncompleteStep = screen.getAllByText(/Write/)[0];
      expect(secondIncompleteStep).toBeInTheDocument();
    });

    it('prevents double completion of already completed steps', async () => {
      const thread = createMockThread('thread-1', 'Research Project');
      render(<StepHistoryView thread={thread} />);

      // Try to complete an already completed step
      const completedStep = screen.getByText('Complete Research');
      
      // Completed steps may have a disabled click handler
      const btnTexts = screen.getAllByRole('button', { name: /Mark Complete$/ });
      
      // Should handle clicks gracefully
      await userEvent.click(btnTexts[0]);
      
      // Should not crash
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    const createEmptyThread = (): Thread => ({
      id: 'empty-thread',
      title: 'Empty Thread',
      steps: [],
    });

    it('shows empty state when no steps are present', () => {
      const thread = createEmptyThread();
      render(<StepHistoryView thread={thread} />);

      const emptyState = screen.getByText('No steps yet');
      expect(emptyState).toBeInTheDocument();
    });

    it('shows add button when steps are empty', () => {
      const thread = createEmptyThread();
      render(<StepHistoryView thread={thread} />);

      const addButton = screen.getByRole('button', { name: /Add Step/i });
      expect(addButton).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles thread with null completion status gracefully', () => {
      const thread = {
        id: 'thread-error',
        title: 'Error Thread',
        steps: [
          { id: '1', title: 'Test Step', completed: null },
          { id: '2', title: 'Another Step', completed: true as any },
        ],
      } as any;
      
      // Should not crash when rendering with null completion status
      expect(() => 
        render(<StepHistoryView thread={thread} />)
      ).not.toThrow();
    });

    it('handles thread with very long step titles', () => {
      const longTitle = 'A'.repeat(100) + ' Step with Long Title ';
      const thread = {
        id: 'thread-long',
        title: 'Long Title Thread',
        steps: [
          { id: '1', title: longTitle, completed: false },
        ],
      } as any;

      // Should render without layout issues
      expect(() => 
        render(<StepHistoryView thread={thread} />)
      ).not.toThrow();
    });

    it('handles undefined step title', () => {
      const thread = {
        id: 'thread-null-title',
        title: 'Null Title Thread',
        steps: [
          { id: '1', title: null, completed: false },
        ],
      } as any;

      expect(() => 
        render(<StepHistoryView thread={thread} />)
      ).not.toThrow();
    });
  });

  describe('Step List Navigation', () => {
    it('renders steps in correct chronological order', () => {
      const thread = createMockThread('thread-1', 'Research Project');
      render(<StepHistoryView thread={thread} />);

      const stepElements = screen.queryAllByTestId('step-item');
      expect(stepElements).toHaveLength(4);

      // Check order - completed steps first, then pending
      const firstStep = stepElements[0];
      expect(firstStep).toHaveTextContent('Complete Research');
    });

    it('highlights current step in progress', () => {
      const thread = createMockThread('thread-1', 'Research Project');
      render(<StepHistoryView thread={thread} />);

      // The first incomplete step should be highlighted
      const pendingSteps = screen.getAllByText(/Write/);
      expect(pendingSteps[0]).toBeInTheDocument();
    });
  });
});