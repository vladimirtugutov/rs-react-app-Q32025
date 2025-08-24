import { FormEvent, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { addFormData } from '../store/formSlice';
import { RootState } from '../store/store';
import { v4 as uuidv4 } from 'uuid';
import './UncontrolledForm.css';

type Props = {
  onSuccess: () => void;
};

type FormData = {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  termsAccepted: boolean;
  country: string;
  imageBase64: string;
};

export default function UncontrolledForm({ onSuccess }: Props) {
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
  const [passwordStrength, setPasswordStrength] = useState<string>('');

  const schema = z
    .object({
      name: z.string().regex(/^[A-Z]/, 'Must start with an uppercase letter'),
      age: z.preprocess(
        (val) => Number(val),
        z.number().positive('Must be a positive number')
      ),
      email: z.string().email('Invalid email'),
      password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .regex(/[A-Z]/, 'Must contain an uppercase letter')
        .regex(/\d/, 'Must contain a number')
        .regex(/\W/, 'Must contain a special character'),
      confirmPassword: z.string(),
      gender: z.string().min(1, 'Gender is required'),
      termsAccepted: z.literal(true, {
        errorMap: () => ({ message: 'Must accept Terms and Conditions' }),
      }),
      country: z.string().min(1, 'Country is required'),
      imageBase64: z.string().min(1, 'Image is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords must match',
      path: ['confirmPassword'],
    });

  const calculatePasswordStrength = (pwd: string): string => {
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/\W/.test(pwd)) strength++;

    switch (strength) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Medium';
      case 4:
        return 'Strong';
      case 5:
        return 'Very Strong';
      default:
        return 'Very Weak';
    }
  };

  const getPasswordStrengthClass = (strength: string): string => {
    return `strength-${strength.toLowerCase().replace(' ', '-')}`;
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const password = event.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getFieldDisplayName = (fieldPath: string): string => {
    const fieldNames: Record<string, string> = {
      name: 'Name',
      age: 'Age',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      gender: 'Gender',
      termsAccepted: 'Terms and Conditions',
      country: 'Country',
      imageBase64: 'Image Upload',
    };

    return fieldNames[fieldPath] || fieldPath;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const file = imageRef.current?.files?.[0];

    const formData: FormData = {
      id: uuidv4(),
      name: nameRef.current?.value || '',
      age: Number(ageRef.current?.value) || 0,
      email: emailRef.current?.value || '',
      password: passwordRef.current?.value || '',
      confirmPassword: confirmPasswordRef.current?.value || '',
      gender: genderRef.current?.value || '',
      termsAccepted: termsRef.current?.checked || false,
      country: countryRef.current?.value || '',
      imageBase64: '', // Будет обновлено ниже если файл выбран
    };

    if (file) {
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        alert('Image Upload: Invalid file type! Only PNG and JPEG allowed.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image Upload: File size too large! Maximum 5MB allowed.');
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        formData.imageBase64 = reader.result as string;
        validateAndSubmit(formData);
      };
    } else {
      validateAndSubmit(formData);
    }
  };

  const validateAndSubmit = async (formData: FormData) => {
    try {
      schema.parse(formData);
      dispatch(addFormData(formData));
      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors
          .map((err) => {
            const fieldName = getFieldDisplayName(err.path[0] as string);
            return `• ${fieldName}: ${err.message}`;
          })
          .join('\n');

        alert(
          `Please fix the following validation errors:\n\n${errorMessages}`
        );
      }
    }
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.length > 0) {
      setFilteredCountries(
        countries.filter((c) => c.toLowerCase().includes(value.toLowerCase()))
      );
    } else {
      setFilteredCountries([]);
    }
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
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input id="name" type="text" ref={nameRef} />
        </div>

        <div className="form-field">
          <label htmlFor="age">Age:</label>
          <input id="age" type="number" ref={ageRef} />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" ref={emailRef} />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
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
        </div>

        <div className="form-field">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            type="password"
            ref={confirmPasswordRef}
          />
        </div>

        <div className="form-field">
          <label htmlFor="gender">Gender:</label>
          <select id="gender" ref={genderRef}>
            <option value="">Select...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="termsAccepted" className="checkbox-label">
            <input id="termsAccepted" type="checkbox" ref={termsRef} />
            Accept Terms and Conditions
          </label>
        </div>

        <div className="form-field">
          <label htmlFor="country">Country:</label>
          <div className="autocomplete-container">
            <input
              id="country"
              type="text"
              ref={countryRef}
              onChange={handleCountryChange}
              placeholder="Start typing..."
              autoComplete="off"
            />
            {filteredCountries.length > 0 && (
              <ul className="autocomplete-dropdown">
                {filteredCountries.slice(0, 10).map((c) => (
                  <li key={c} onClick={() => handleSelectCountry(c)}>
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="imageFile">Upload Image (PNG/JPEG):</label>
          <input
            id="imageFile"
            type="file"
            ref={imageRef}
            accept="image/png,image/jpeg"
          />
        </div>

        <button type="submit" className="submit-button">
          Submit Form
        </button>
      </form>
    </div>
  );
}
