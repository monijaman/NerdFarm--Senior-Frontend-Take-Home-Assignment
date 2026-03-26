import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SchemaRenderer } from '@/features/schemaRenderer/SchemaRenderer';
import type { TaskSchema, FormData } from '@/types/schema';
import { useState } from 'react';

// Stateful test wrapper that manages form data internally
function TestFormWrapper({
  schema,
  activeRole = 'processor' as const,
  onAction,
}: {
  schema: TaskSchema;
  activeRole?: 'processor' | 'attorney';
  onAction: (actionKey: string) => void;
}) {
  // Initialize form data with all fields from schema
  const initialData: FormData = {};
  schema.sections.forEach(section => {
    section.fields.forEach(field => {
      if (field.type === 'checkbox') {
        initialData[field.key] = false;
      } else if (field.type === 'select') {
        initialData[field.key] = null;
      } else {
        initialData[field.key] = '';
      }
    });
  });

  const [formData, setFormData] = useState<FormData>(initialData);

  const handleFieldChange = (key: string, value: FormData[string]) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SchemaRenderer
      schema={schema}
      formData={formData}
      activeRole={activeRole}
      onAction={onAction}
      onFieldChange={handleFieldChange}
    />
  );
}

// Test helper
const renderTestForm = (
  schema: TaskSchema,
  activeRole: 'processor' | 'attorney' = 'processor'
) => {
  const mockOnAction = vi.fn();

  const utils = render(
    <TestFormWrapper
      schema={schema}
      activeRole={activeRole}
      onAction={mockOnAction}
    />
  );

  return { ...utils, mockOnAction };
};

// Mock schema for integration testing with multiple field types
const mockIntegrationSchema: TaskSchema = {
  schemaRef: 'integration-test-schema',
  title: 'Integration Test Form',
  description: 'Testing complete workflow from task selection to form submission.',
  sections: [
    {
      key: 'basic-info',
      heading: 'Basic Information',
      fields: [
        {
          key: 'clientName',
          label: 'Client Name',
          type: 'text',
          required: true,
          placeholder: 'Enter client name',
        },
        {
          key: 'reviewType',
          label: 'Review Type',
          type: 'select',
          required: true,
          options: ['Standard', 'Expedited', 'Special'],
        },
        {
          key: 'needsAttention',
          label: 'Needs Attorney Attention',
          type: 'checkbox',
          required: false,
        },
        {
          key: 'attorneyNotes',
          label: 'Attorney Notes',
          type: 'textarea',
          required: true,
          visibleWhen: { field: 'needsAttention', equals: true },
        },
      ],
    },
    {
      key: 'decision',
      heading: 'Decision',
      fields: [
        {
          key: 'outcome',
          label: 'Outcome',
          type: 'select',
          required: true,
          options: ['Approved', 'Rejected', 'Pending'],
        },
        {
          key: 'rejectionReason',
          label: 'Rejection Reason',
          type: 'textarea',
          required: true,
          visibleWhen: { field: 'outcome', equals: 'Rejected' },
        },
      ],
    },
  ],
  actions: [
    { key: 'submit', label: 'Submit', variant: 'primary', requiresAllRequired: true },
    { key: 'save-draft', label: 'Save Draft', variant: 'secondary' },
  ],
  roleVisibility: {
    processor: { hiddenFields: [], disabledActions: [] },
    attorney: { hiddenFields: [], disabledActions: [] },
  },
};

describe('Integration: Complete task workflow from selection to submission', () => {
  it('renders form with all sections and fields', () => {
    renderTestForm(mockIntegrationSchema);

    // Verify title and description
    expect(screen.getByText('Integration Test Form')).toBeInTheDocument();
    expect(screen.getByText(/Testing complete workflow/i)).toBeInTheDocument();

    // Verify section headings
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByText('Decision')).toBeInTheDocument();

    // Verify always-visible fields
    expect(screen.getByLabelText(/Client Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Review Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Needs Attorney Attention/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Outcome/i)).toBeInTheDocument();

    // Verify action buttons
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Draft/i })).toBeInTheDocument();
  });

  it('disables primary action when required fields are empty', () => {
    renderTestForm(mockIntegrationSchema);

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables primary action after filling all required fields', async () => {
    renderTestForm(mockIntegrationSchema);

    // Initially disabled
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    expect(submitButton).toBeDisabled();

    // Fill required text field
    const clientNameInput = screen.getByLabelText(/Client Name/i);
    fireEvent.change(clientNameInput, { target: { value: 'Test Client' } });

    // Fill required select field (reviewType)
    const reviewTypeSelect = screen.getByLabelText(/Review Type/i);
    fireEvent.change(reviewTypeSelect, { target: { value: 'Standard' } });

    // Fill required select field (outcome)
    const outcomeSelect = screen.getByLabelText(/Outcome/i);
    fireEvent.change(outcomeSelect, { target: { value: 'Approved' } });

    // Wait for validation to process
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('shows conditional field when checkbox is checked and keeps primary disabled until filled', async () => {
    renderTestForm(mockIntegrationSchema);

    const submitButton = screen.getByRole('button', { name: /Submit/i });

    // Fill main required fields first
    fireEvent.change(screen.getByLabelText(/Client Name/i), { target: { value: 'Test Client' } });
    fireEvent.change(screen.getByLabelText(/Review Type/i), { target: { value: 'Standard' } });
    fireEvent.change(screen.getByLabelText(/Outcome/i), { target: { value: 'Approved' } });

    // Submit should be enabled now
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    // Check the "needsAttention" checkbox
    const needsAttentionCheckbox = screen.getByLabelText(/Needs Attorney Attention/i);
    fireEvent.click(needsAttentionCheckbox);

    // Conditional field should appear
    await waitFor(() => {
      expect(screen.getByLabelText(/Attorney Notes/i)).toBeInTheDocument();
    });

    // Submit should now be disabled (new required field appeared and is empty)
    expect(submitButton).toBeDisabled();

    // Fill the conditional required field
    const attorneyNotesInput = screen.getByLabelText(/Attorney Notes/i);
    fireEvent.change(attorneyNotesInput, { target: { value: 'Needs review by senior attorney' } });

    // Submit should be enabled again
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('shows conditional field based on select value and validates it', async () => {
    renderTestForm(mockIntegrationSchema);

    const submitButton = screen.getByRole('button', { name: /Submit/i });

    // Fill main required fields
    fireEvent.change(screen.getByLabelText(/Client Name/i), { target: { value: 'Test Client' } });
    fireEvent.change(screen.getByLabelText(/Review Type/i), { target: { value: 'Standard' } });

    // Select "Rejected" outcome to trigger conditional field
    fireEvent.change(screen.getByLabelText(/Outcome/i), { target: { value: 'Rejected' } });

    // Conditional "rejectionReason" field should appear
    await waitFor(() => {
      expect(screen.getByLabelText(/Rejection Reason/i)).toBeInTheDocument();
    });

    // Submit should be disabled (rejectionReason is required and empty)
    expect(submitButton).toBeDisabled();

    // Fill the rejection reason
    const rejectionReasonInput = screen.getByLabelText(/Rejection Reason/i);
    fireEvent.change(rejectionReasonInput, { target: { value: 'Missing documentation' } });

    // Submit should be enabled
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('calls onAction when primary action is clicked after form is valid', async () => {
    const { mockOnAction } = renderTestForm(mockIntegrationSchema);

    // Fill all required fields
    fireEvent.change(screen.getByLabelText(/Client Name/i), { target: { value: 'Test Client' } });
    fireEvent.change(screen.getByLabelText(/Review Type/i), { target: { value: 'Expedited' } });
    fireEvent.change(screen.getByLabelText(/Outcome/i), { target: { value: 'Approved' } });

    const submitButton = screen.getByRole('button', { name: /Submit/i });

    // Wait for button to be enabled
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });

    // Click the button
    fireEvent.click(submitButton);

    // Verify onAction was called with correct action key
    expect(mockOnAction).toHaveBeenCalledWith('submit');
  });

  it('allows secondary action even when form is invalid', () => {
    const { mockOnAction } = renderTestForm(mockIntegrationSchema);

    // Don't fill any fields
    const saveDraftButton = screen.getByRole('button', { name: /Save Draft/i });

    // Secondary button should be enabled
    expect(saveDraftButton).not.toBeDisabled();

    // Click should work
    fireEvent.click(saveDraftButton);
    expect(mockOnAction).toHaveBeenCalledWith('save-draft');
  });

  it('maintains validation state when switching between conditional branches', async () => {
    renderTestForm(mockIntegrationSchema);

    const submitButton = screen.getByRole('button', { name: /Submit/i });

    // Fill main required fields
    fireEvent.change(screen.getByLabelText(/Client Name/i), { target: { value: 'Test Client' } });
    fireEvent.change(screen.getByLabelText(/Review Type/i), { target: { value: 'Standard' } });

    // Select "Rejected" to show rejection reason
    fireEvent.change(screen.getByLabelText(/Outcome/i), { target: { value: 'Rejected' } });

    await waitFor(() => {
      expect(screen.getByLabelText(/Rejection Reason/i)).toBeInTheDocument();
    });

    // Submit disabled (rejectionReason empty)
    expect(submitButton).toBeDisabled();

    // Switch to "Approved" (no conditional field)
    fireEvent.change(screen.getByLabelText(/Outcome/i), { target: { value: 'Approved' } });

    // Rejection reason should disappear
    await waitFor(() => {
      expect(screen.queryByLabelText(/Rejection Reason/i)).not.toBeInTheDocument();
    });

    // Submit should be enabled (no required fields missing)
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
