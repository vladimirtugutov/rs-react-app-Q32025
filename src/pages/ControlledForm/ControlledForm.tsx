import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch, useSelector } from 'react-redux';
import { addFormData } from '../../store/formSlice';
import { RootState } from '../../store/store';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './ControlledForm.css';
import {
  calculatePasswordStrength,
  getPasswordStrengthClass,
} from '../../utils/passwordUtils';
import { filterCountries } from '../../utils/countryUtils';
import { compressImage, validateImageFile } from '../../utils/imageUtils';
import { formSchema, FormData } from '../../utils/formSchema';
import { FormField } from '../../utils/formFields';
import { FormFieldWrapper } from '../../components/FormFieldWrapper/FormFieldWrapper';

type ControlledFormProps = {
  onSuccess: () => void;
};

export const ControlledForm = ({ onSuccess }: ControlledFormProps) => {
  const dispatch = useDispatch();
  const countries = useSelector((state: RootState) => state.countries || []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);

  const password = watch(FormField.Password, '');
  const confirmPassword = watch(FormField.ConfirmPassword, '');

  const handlePasswordBlur = async () => {
    await trigger([FormField.Password, FormField.ConfirmPassword]);
  };

  const onSubmit = (data: FormData) => {
    const { confirmPassword: _, ...rest } = data;
    dispatch(addFormData({ ...rest, id: uuidv4() }));
    onSuccess();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const error = validateImageFile(file);
      if (error) {
        alert(`Image Upload: ${error}`);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          const originalBase64 = reader.result as string;
          const compressedBase64 = await compressImage(originalBase64);
          setValue(FormField.ImageBase64, compressedBase64, {
            shouldValidate: true,
          });
        } catch (error) {
          console.error('Image compression failed:', error);
          setValue(FormField.ImageBase64, reader.result as string, {
            shouldValidate: true,
          });
        }
      };
    }
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue(FormField.Country, value, { shouldValidate: true });
    setFilteredCountries(
      value.length > 0 ? filterCountries(countries, value) : []
    );
  };

  const handleSelectCountry = (country: string) => {
    setValue(FormField.Country, country, { shouldValidate: true });
    setFilteredCountries([]);
  };

  const passwordStrength = calculatePasswordStrength(password);

  return (
    <div className="controlled-form">
      <h1>Controlled Form (React Hook Form)</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <FormFieldWrapper label="Name:" htmlFor={FormField.Name} error={errors.name?.message}>
          <input id={FormField.Name} type="text" {...register(FormField.Name)} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Age:" htmlFor={FormField.Age} error={errors.age?.message}>
          <input
            id={FormField.Age}
            type="number"
            {...register(FormField.Age, { valueAsNumber: true })}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label="Email:" htmlFor={FormField.Email} error={errors.email?.message}>
          <input id={FormField.Email} type="email" {...register(FormField.Email)} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Password:" htmlFor={FormField.Password} error={errors.password?.message}>
          <input
            id={FormField.Password}
            type="password"
            {...register(FormField.Password)}
            onBlur={handlePasswordBlur}
          />
          {password && (
            <div className="password-strength">
              Password Strength:{' '}
              <span className={getPasswordStrengthClass(passwordStrength)}>{passwordStrength}</span>
            </div>
          )}
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Confirm Password:"
          htmlFor={FormField.ConfirmPassword}
          error={errors.confirmPassword?.message}
        >
          <input
            id={FormField.ConfirmPassword}
            type="password"
            {...register(FormField.ConfirmPassword)}
            onBlur={handlePasswordBlur}
          />
          {password && confirmPassword && (
            <div className={`password-match ${password === confirmPassword ? 'match' : 'no-match'}`}>
              {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
            </div>
          )}
        </FormFieldWrapper>

        <FormFieldWrapper label="Gender:" htmlFor={FormField.Gender} error={errors.gender?.message}>
          <select id={FormField.Gender} {...register(FormField.Gender)}>
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Accept Terms and Conditions"
          htmlFor={FormField.TermsAccepted}
          error={errors.termsAccepted?.message}
          wrapInLabel
        >
          <input id={FormField.TermsAccepted} type="checkbox" {...register(FormField.TermsAccepted)} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Country:" htmlFor={FormField.Country} error={errors.country?.message}>
          <div className="autocomplete-container">
            <input
              id={FormField.Country}
              type="text"
              {...register(FormField.Country)}
              onChange={handleCountryChange}
              placeholder="Start typing..."
              autoComplete="off"
            />
            {filteredCountries.length > 0 && (
              <ul className="autocomplete-dropdown">
                {filteredCountries.map((country) => (
                  <li key={country} onClick={() => handleSelectCountry(country)}>
                    {country}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Upload Image (PNG/JPEG):"
          htmlFor="imageFile"
          error={errors.imageBase64?.message}
        >
          <input id="imageFile" type="file" onChange={handleFileUpload} accept="image/png,image/jpeg" />
        </FormFieldWrapper>

        <button type="submit" disabled={!isValid} className="submit-button">
          Submit Form
        </button>
      </form>
    </div>
  );
};
