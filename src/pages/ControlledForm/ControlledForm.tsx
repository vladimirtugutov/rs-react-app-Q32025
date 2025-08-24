import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { addFormData } from '../../store/formSlice';
import { RootState } from '../../store/store';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './ControlledForm.css';

type Props = {
  onSuccess: () => void;
};

const schema = z
  .object({
    name: z.string().regex(/^[A-Z]/, 'Must start with an uppercase letter'),
    age: z.number().positive('Must be a positive number'),
    email: z.string().email('Invalid email'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/\d/, 'Must contain a number')
      .regex(/\W/, 'Must contain a special character'),
    confirmPassword: z.string(),
    gender: z.enum(['male', 'female', 'other']),
    termsAccepted: z.boolean().refine((val) => val === true, 'Must accept T&C'),
    country: z.string().min(1, 'Country is required'),
    imageBase64: z.string().min(1, 'Image is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export const ControlledForm = ({ onSuccess }: Props) => {
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
    resolver: zodResolver(schema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);

  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  const getPasswordStrength = (pwd: string): string => {
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

  const handlePasswordBlur = async () => {
    await trigger(['password', 'confirmPassword']);
  };

  const onSubmit = (data: FormData) => {
    const newEntry = { ...data, id: uuidv4() };
    dispatch(addFormData(newEntry));
    onSuccess();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
        setValue('imageBase64', reader.result as string, {
          shouldValidate: true,
        });
      };
    }
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setValue('country', value, { shouldValidate: true });

    if (value.length > 0) {
      setFilteredCountries(
        countries.filter((c) => c.toLowerCase().includes(value.toLowerCase()))
      );
    } else {
      setFilteredCountries([]);
    }
  };

  const handleSelectCountry = (country: string) => {
    setValue('country', country, { shouldValidate: true });
    setFilteredCountries([]);
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="controlled-form">
      <h1>Controlled Form (React Hook Form)</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="form-field">
          <label htmlFor="name">Name:</label>
          <input id="name" type="text" {...register('name')} />
          {errors.name && (
            <p className="error-message">{errors.name.message}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="age">Age:</label>
          <input
            id="age"
            type="number"
            {...register('age', { valueAsNumber: true })}
          />
          {errors.age && <p className="error-message">{errors.age.message}</p>}
        </div>

        <div className="form-field">
          <label htmlFor="email">Email:</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            {...register('password')}
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
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
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
          <label htmlFor="gender">Gender:</label>
          <select id="gender" {...register('gender')}>
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
          <label htmlFor="termsAccepted" className="checkbox-label">
            <input
              id="termsAccepted"
              type="checkbox"
              {...register('termsAccepted')}
            />
            Accept Terms and Conditions
          </label>
          {errors.termsAccepted && (
            <p className="error-message">{errors.termsAccepted.message}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="country">Country:</label>
          <div className="autocomplete-container">
            <input
              id="country"
              type="text"
              {...register('country')}
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
          {errors.country && (
            <p className="error-message">{errors.country.message}</p>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="imageFile">Upload Image (PNG/JPEG) *:</label>
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

        <div
          className="debug-info"
          style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}
        >
          Form valid: {isValid ? 'Yes' : 'No'} | Errors:{' '}
          {Object.keys(errors).length} | Image loaded:{' '}
          {watch('imageBase64') ? 'Yes' : 'No'}
        </div>
      </form>
    </div>
  );
};
