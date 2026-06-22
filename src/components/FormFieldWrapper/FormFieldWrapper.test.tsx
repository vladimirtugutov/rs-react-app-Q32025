import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormFieldWrapper } from './FormFieldWrapper';

describe('FormFieldWrapper', () => {
  it('should render label and children', () => {
    render(
      <FormFieldWrapper label="Name:" htmlFor="name">
        <input id="name" type="text" />
      </FormFieldWrapper>
    );

    expect(screen.getByLabelText('Name:')).toBeInTheDocument();
  });

  it('should render error message when provided', () => {
    render(
      <FormFieldWrapper label="Name:" htmlFor="name" error="Required field">
        <input id="name" type="text" />
      </FormFieldWrapper>
    );

    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('should not render error message when not provided', () => {
    render(
      <FormFieldWrapper label="Name:" htmlFor="name">
        <input id="name" type="text" />
      </FormFieldWrapper>
    );

    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
  });

  it('should wrap children inside label when wrapInLabel is true', () => {
    render(
      <FormFieldWrapper label="Accept Terms" htmlFor="terms" wrapInLabel>
        <input id="terms" type="checkbox" />
      </FormFieldWrapper>
    );

    const checkbox = screen.getByLabelText('Accept Terms');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.closest('label')).toHaveClass('checkbox-label');
  });

  it('should render label before children when wrapInLabel is false', () => {
    render(
      <FormFieldWrapper label="Name:" htmlFor="name">
        <input id="name" type="text" />
      </FormFieldWrapper>
    );

    const label = screen.getByText('Name:');
    expect(label.tagName).toBe('LABEL');
    expect(label).not.toHaveClass('checkbox-label');
  });
});