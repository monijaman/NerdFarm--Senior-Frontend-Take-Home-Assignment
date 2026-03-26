import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SchemaRenderer } from '@/features/schemaRenderer';
import type { TaskSchema, FormData } from '@/types/schema';

const schema: TaskSchema = {
  schemaRef: 'test-schema',
  title: 'Test Form',
  description: 'A test schema',
  sections: [
    {
      key: 'basic',
      heading: 'Basic Info',
      fields: [
        { key: 'vestingType', label: 'Vesting Type', type: 'select', options: ['Fee Simple', 'Joint Tenancy'], required: true },
        { key: 'notes', label: 'Notes', type: 'textarea' },
        { key: 'confirmed', label: 'Confirmed', type: 'checkbox', required: true },
      ],
    },
    {
      key: 'conditional',
      heading: 'Conditional Section',
      fields: [
        { key: 'titleStatus', label: 'Title Status', type: 'select', options: ['Clear', 'Defects Found'], required: true },
        {
          key: 'defectDesc',
          label: 'Defect Description',
          type: 'textarea',
          required: true,
          visibleWhen: { field: 'titleStatus', equals: 'Defects Found' },
        },
      ],
    },
  ],
  actions: [
    { key: 'approve', label: 'Approve', variant: 'primary', requiresAllRequired: true },
    { key: 'reject', label: 'Reject', variant: 'secondary' },
  ],
  roleVisibility: {
    processor: { hiddenFields: [], disabledActions: [] },
    attorney: { hiddenFields: ['notes'], disabledActions: ['approve'] },
  },
};

function emptyForm(): FormData {
  return {
    vestingType: null,
    notes: '',
    confirmed: false,
    titleStatus: null,
    defectDesc: '',
  };
}

describe('SchemaRenderer — field rendering', () => {
  it('renders section headings from schema', () => {
    render(
      <SchemaRenderer
        schema={schema}
        formData={emptyForm()}
        activeRole="processor"
        onFieldChange={() => {}}
        onAction={() => {}}
      />,
    );
    expect(screen.getByText('Basic Info')).toBeInTheDocument();
    expect(screen.getByText('Conditional Section')).toBeInTheDocument();
  });

  it('renders select field with label', () => {
    render(
      <SchemaRenderer
        schema={schema}
        formData={emptyForm()}
        activeRole="processor"
        onFieldChange={() => {}}
        onAction={() => {}}
      />,
    );
    expect(screen.getByLabelText(/Vesting Type/i)).toBeInTheDocument();
  });

  it('renders checkbox field', () => {
    render(
      <SchemaRenderer
        schema={schema}
        formData={emptyForm()}
        activeRole="processor"
        onFieldChange={() => {}}
        onAction={() => {}}
      />,
    );
    expect(screen.getByLabelText(/Confirmed/i)).toBeInTheDocument();
  });
});

describe('SchemaRenderer — role-based visibility', () => {
  it('hides fields in hiddenFields for the active role', () => {
    render(
      <SchemaRenderer
        schema={schema}
        formData={emptyForm()}
        activeRole="attorney"
        onFieldChange={() => {}}
        onAction={() => {}}
      />,
    );
    // notes is hidden for attorney
    expect(screen.queryByLabelText(/Notes/i)).not.toBeInTheDocument();
  });

  it('disables action buttons in disabledActions for the active role', () => {
    render(
      <SchemaRenderer
        schema={schema}
        formData={emptyForm()}
        activeRole="attorney"
        onFieldChange={() => {}}
        onAction={() => {}}
      />,
    );
    const approveBtn = screen.getByRole('button', { name: /Approve/i });
    expect(approveBtn).toBeDisabled();
  });

  it('non-primary action (reject) is always enabled regardless of form validity', () => {
    render(
      <SchemaRenderer
        schema={schema}
        formData={emptyForm()}
        activeRole="processor"
        onFieldChange={() => {}}
        onAction={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: /Reject/i })).not.toBeDisabled();
  });
});

describe('SchemaRenderer — conditional visibility (visibleWhen)', () => {
  it('hides defectDesc when titleStatus is null', () => {
    render(
      <SchemaRenderer
        schema={schema}
        formData={{ ...emptyForm(), titleStatus: null }}
        activeRole="processor"
        onFieldChange={() => {}}
        onAction={() => {}}
      />,
    );
    expect(screen.queryByLabelText(/Defect Description/i)).not.toBeInTheDocument();
  });

  it('shows defectDesc when titleStatus equals "Defects Found"', () => {
    render(
      <SchemaRenderer
        schema={schema}
        formData={{ ...emptyForm(), titleStatus: 'Defects Found' }}
        activeRole="processor"
        onFieldChange={() => {}}
        onAction={() => {}}
      />,
    );
    expect(screen.getByLabelText(/Defect Description/i)).toBeInTheDocument();
  });
});

describe('SchemaRenderer — primary action gating', () => {
  it('disables Approve when required fields are empty', () => {
    render(
      <SchemaRenderer
        schema={schema}
        formData={emptyForm()}
        activeRole="processor"
        onFieldChange={() => {}}
        onAction={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: /Approve/i })).toBeDisabled();
  });

  it('enables Approve only when all visible required fields are filled', () => {
    // With titleStatus = 'Clear', defectDesc is hidden (not required).
    // Required visible: vestingType, confirmed, titleStatus
    render(
      <SchemaRenderer
        schema={schema}
        formData={{
          vestingType: 'Fee Simple',
          notes: '',
          confirmed: true,
          titleStatus: 'Clear',
          defectDesc: '',
        }}
        activeRole="processor"
        onFieldChange={() => {}}
        onAction={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: /Approve/i })).not.toBeDisabled();
  });

  it('keeps Approve disabled when a visible conditional required field is unfilled', () => {
    // titleStatus = 'Defects Found' makes defectDesc visible+required but empty
    render(
      <SchemaRenderer
        schema={schema}
        formData={{
          vestingType: 'Fee Simple',
          notes: '',
          confirmed: true,
          titleStatus: 'Defects Found',
          defectDesc: '',
        }}
        activeRole="processor"
        onFieldChange={() => {}}
        onAction={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: /Approve/i })).toBeDisabled();
  });

  it('enables Approve when conditional required field is filled', () => {
    render(
      <SchemaRenderer
        schema={schema}
        formData={{
          vestingType: 'Fee Simple',
          notes: '',
          confirmed: true,
          titleStatus: 'Defects Found',
          defectDesc: 'There are defects.',
        }}
        activeRole="processor"
        onFieldChange={() => {}}
        onAction={() => {}}
      />,
    );
    expect(screen.getByRole('button', { name: /Approve/i })).not.toBeDisabled();
  });

  it('fires onAction with correct key when a button is clicked', () => {
    const onAction = vi.fn();
    render(
      <SchemaRenderer
        schema={schema}
        formData={{
          vestingType: 'Fee Simple',
          notes: '',
          confirmed: true,
          titleStatus: 'Clear',
          defectDesc: '',
        }}
        activeRole="processor"
        onFieldChange={() => {}}
        onAction={onAction}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: /Reject/i }));
    expect(onAction).toHaveBeenCalledWith('reject');
  });
});
