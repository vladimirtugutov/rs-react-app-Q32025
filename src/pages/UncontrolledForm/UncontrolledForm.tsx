import { FormEvent, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { addFormData } from '../../store/formSlice';
import { RootState } from '../../store/store';
import { v4 as uuidv4 } from 'uuid';
import './UncontrolledForm.css';
import {
  calculatePasswordStrength,
  getPasswordStrengthClass,
} from '../../utils/passwordUtils';
import { filterCountries } from '../../utils/countryUtils';
import { compressImage, validateImageFile } from '../../utils/imageUtils';
import { formSchema, FormData } from '../../utils/formSchema';
import { FormField } from '../../utils/formFields';
import { FormFieldWrapper } from '../../components/FormFieldWrapper/FormFieldWrapper';

type UncontrolledFormProps = {
  onSuccess: () => void;
};

const FIELD_DISPLAY_NAMES: Record<string, string> = {
  [FormField.Name]: 'Name',
  [FormField.Age]: 'Age',
  [FormField.Email]: 'Email',
  [FormField.Password]: 'Password',
  [FormField.ConfirmPassword]: 'Confirm Password',
  [FormField.Gender]: 'Gender',
  [FormField.TermsAccepted]: 'Terms and Conditions',
  [FormField.Country]: 'Country',
  [FormField.ImageBase64]: 'Image Upload',
};

export const UncontrolledForm = ({ onSuccess }: UncontrolledFormProps) => {
  const dispatch = useDispatch();
  const countries = useSelector((state: RootState) => state.countries);

  const nameRef = useRef<HTMLInputElement | null>(null);
  const ageRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const confirmPasswordRef = useRef<HTMLInputElement | null>(null);
  const genderRef = useRef<HTMLSelectElement | null>(null);
  const termsRef = useRef<HTMLInputElement | null>(null);
  const countryRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);

  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const [passwordStrength, setPasswordStrength] = useState('');

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordStrength(calculatePasswordStrength(event.target.value));
  };

  const validateAndSubmit = (formData: FormData) => {
    try {
      formSchema.parse(formData);
      const { confirmPassword: _, ...rest } = formData;
      dispatch(addFormData({ ...rest, id: uuidv4() }));
      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors
          .map((err) => {
            const fieldName = FIELD_DISPLAY_NAMES[err.path[0] as string] ?? err.path[0];
            return `• ${fieldName}: ${err.message}`;
          })
          .join('\n');
        alert(`Please fix the following validation errors:\n\n${errorMessages}`);
      }
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const file = imageRef.current?.files?.[0];

    const formData: FormData = {
      name: nameRef.current?.value || '',
      age: Number(ageRef.current?.value) || 0,
      email: emailRef.current?.value || '',
      password: passwordRef.current?.value || '',
      confirmPassword: confirmPasswordRef.current?.value || '',
      gender: genderRef.current?.value as 'male' | 'female' | 'other',
      termsAccepted: termsRef.current?.checked || false,
      country: countryRef.current?.value || '',
      imageBase64: '',
    };

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
          formData.imageBase64 = await compressImage(reader.result as string);
        } catch {
          formData.imageBase64 = reader.result as string;
        }
        validateAndSubmit(formData);
      };
    } else {
      validateAndSubmit(formData);
    }
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilteredCountries(value.length > 0 ? filterCountries(countries, value) : []);
  };

  const handleSelectCountry = (country: string) => {
    if (countryRef.current) {
      countryRef.current.value = country;
    }
    setFilteredCountries([]);
  };

  return (
    <div className="uncontrolled-form">
      <h1>Uncontrolled Form (DOM-managed)</h1>
      <form onSubmit={handleSubmit} className="form">
        <FormFieldWrapper label="Name:" htmlFor={FormField.Name}>
          <input id={FormField.Name} type="text" ref={nameRef} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Age:" htmlFor={FormField.Age}>
          <input id={FormField.Age} type="number" ref={ageRef} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Email:" htmlFor={FormField.Email}>
          <input id={FormField.Email} type="email" ref={emailRef} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Password:" htmlFor={FormField.Password}>
          <input
            id={FormField.Password}
            type="password"
            ref={passwordRef}
            onChange={handlePasswordChange}
          />
          {passwordStrength && (
            <div className="password-strength">
              Password Strength:{' '}
              <span className={getPasswordStrengthClass(passwordStrength)}>
                {passwordStrength}
              </span>
            </div>
          )}
        </FormFieldWrapper>

        <FormFieldWrapper label="Confirm Password:" htmlFor={FormField.ConfirmPassword}>
          <input id={FormField.ConfirmPassword} type="password" ref={confirmPasswordRef} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Gender:" htmlFor={FormField.Gender}>
          <select id={FormField.Gender} ref={genderRef}>
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </FormFieldWrapper>

        <FormFieldWrapper
          label="Accept Terms and Conditions"
          htmlFor={FormField.TermsAccepted}
          wrapInLabel
        >
          <input id={FormField.TermsAccepted} type="checkbox" ref={termsRef} />
        </FormFieldWrapper>

        <FormFieldWrapper label="Country:" htmlFor={FormField.Country}>
          <div className="autocomplete-container">
            <input
              id={FormField.Country}
              type="text"
              ref={countryRef}
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

        <FormFieldWrapper label="Upload Image (PNG/JPEG):" htmlFor="imageFile">
          <input id="imageFile" type="file" ref={imageRef} accept="image/png,image/jpeg" />
        </FormFieldWrapper>

        <button type="submit" className="submit-button">
          Submit Form
        </button>
      </form>
    </div>
  );
};