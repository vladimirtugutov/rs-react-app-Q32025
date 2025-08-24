import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { addFormData } from '../store/formSlice';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
    imageBase64: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function ControlledForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const countries = useSelector((state: RootState) => state.countries || []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);

  const onSubmit = (data: FormData) => {
    const newEntry = { ...data, id: uuidv4() };
    dispatch(addFormData(newEntry));

    if (
      window.confirm(
        'Form submitted successfully! Press OK to go to main page.'
      )
    ) {
      navigate('/');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        alert('Invalid file type! Only PNG and JPEG allowed.');
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

  return (
    <div>
      <h1>Controlled Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Name:</label>
        <input id="name" type="text" {...register('name')} />
        {errors.name && <p>{errors.name.message}</p>}

        <label htmlFor="age">Age:</label>
        <input
          id="age"
          type="number"
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && <p>{errors.age.message}</p>}

        <label htmlFor="email">Email:</label>
        <input id="email" type="email" {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}

        <label htmlFor="password">Password:</label>
        <input id="password" type="password" {...register('password')} />
        {errors.password && <p>{errors.password.message}</p>}

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

        <label htmlFor="gender">Gender:</label>
        <select id="gender" {...register('gender')}>
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <p>{errors.gender.message}</p>}

        <label htmlFor="termsAccepted">Accept T&C:</label>
        <input
          id="termsAccepted"
          type="checkbox"
          {...register('termsAccepted')}
        />
        {errors.termsAccepted && <p>{errors.termsAccepted.message}</p>}

        <label htmlFor="country">Country:</label>
        <input
          id="country"
          type="text"
          {...register('country')}
          onChange={handleCountryChange}
          placeholder="Start typing..."
        />
        {errors.country && <p>{errors.country.message}</p>}

        {filteredCountries.length > 0 && (
          <ul className="autocomplete-dropdown">
            {filteredCountries.map((c) => (
              <li key={c} onClick={() => handleSelectCountry(c)}>
                {c}
              </li>
            ))}
          </ul>
        )}

        <label htmlFor="imageBase64">Upload Image:</label>
        <input id="imageBase64" type="file" onChange={handleFileUpload} />
        {errors.imageBase64 && <p>{errors.imageBase64.message}</p>}

        <button type="submit" disabled={!isValid}>
          Submit
        </button>
      </form>
    </div>
  );
}
