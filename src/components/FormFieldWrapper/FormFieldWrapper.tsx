type FormFieldWrapperProps = {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  wrapInLabel?: boolean;
};

export const FormFieldWrapper = ({
  label,
  htmlFor,
  error,
  children,
  wrapInLabel = false,
}: FormFieldWrapperProps) => (
  <div className="form-field">
    {wrapInLabel ? (
      <label htmlFor={htmlFor} className="checkbox-label">
        {children}
        {label}
      </label>
    ) : (
      <>
        <label htmlFor={htmlFor}>{label}</label>
        {children}
      </>
    )}
    {error && <p className="error-message">{error}</p>}
  </div>
);