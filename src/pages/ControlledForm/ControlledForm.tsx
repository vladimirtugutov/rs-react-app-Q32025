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
        <div className="form-field">
          <label htmlFor={FormField.Name}>Name:</label>
          <input
            id={FormField.Name}
            type="text"
            {...register(FormField.Name)}
          />
          {errors.name && (
            <p className="error-message">{errors.name.message}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={FormField.Age}>Age:</label>
          <input
            id={FormField.Age}
            type="number"
            {...register(FormField.Age, { valueAsNumber: true })}
          />
          {errors.age && <p className="error-message">{errors.age.message}</p>}
        </div>

        <div className="form-field">
          <label htmlFor={FormField.Email}>Email:</label>
          <input
            id={FormField.Email}
            type="email"
            {...register(FormField.Email)}
          />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={FormField.Password}>Password:</label>
          <input
            id={FormField.Password}
            type="password"
            {...register(FormField.Password)}
            onBlur={handlePasswordBlur}
          />
          {password && (
            <div className="password-strength">
              Password Strength:{' '}
              <span className={getPasswordStrengthClass(passwordStrength)}>
                {passwordStrength}
              </span>
            </div>
          )}
          {errors.password && (
            <p className="error-message">{errors.password.message}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={FormField.ConfirmPassword}>Confirm Password:</label>
          <input
            id={FormField.ConfirmPassword}
            type="password"
            {...register(FormField.ConfirmPassword)}
            onBlur={handlePasswordBlur}
          />
          {password && confirmPassword && (
            <div
              className={`password-match ${password === confirmPassword ? 'match' : 'no-match'}`}
            >
              {password === confirmPassword
                ? '✓ Passwords match'
                : '✗ Passwords do not match'}
            </div>
          )}
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={FormField.Gender}>Gender:</label>
          <select id={FormField.Gender} {...register(FormField.Gender)}>
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && (
            <p className="error-message">{errors.gender.message}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={FormField.TermsAccepted} className="checkbox-label">
            <input
              id={FormField.TermsAccepted}
              type="checkbox"
              {...register(FormField.TermsAccepted)}
            />
            Accept Terms and Conditions
          </label>
          {errors.termsAccepted && (
            <p className="error-message">{errors.termsAccepted.message}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor={FormField.Country}>Country:</label>
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
                  <li
                    key={country}
                    onClick={() => handleSelectCountry(country)}
                  >
                    {country}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {errors.country && (
            <p className="error-message">{errors.country.message}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="imageFile">Upload Image (PNG/JPEG):</label>
          <input
            id="imageFile"
            type="file"
            onChange={handleFileUpload}
            accept="image/png,image/jpeg"
          />
          {errors.imageBase64 && (
            <p className="error-message">{errors.imageBase64.message}</p>
          )}
        </div>

        <button type="submit" disabled={!isValid} className="submit-button">
          Submit Form
        </button>
      </form>
    </div>
  );
};
