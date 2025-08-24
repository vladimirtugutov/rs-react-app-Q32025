import { FormEvent, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { addFormData } from '../store/formSlice';
import { RootState } from '../store/store';
import { v4 as uuidv4 } from 'uuid';

interface FormData {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  termsAccepted: boolean;
  country: string;
  imageBase64?: string;
}

export default function UncontrolledForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 🔥 Получаем список стран из Redux
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
        errorMap: () => ({ message: 'Must accept T&C' }),
      }),
      country: z.string().min(1, 'Country is required'),
      imageBase64: z.string().optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords must match',
      path: ['confirmPassword'],
    });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

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
      imageBase64: '',
    };

    const file = imageRef.current?.files?.[0];
    if (file) {
      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        alert('Invalid file type! Only PNG and JPEG allowed.');
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

      if (
        window.confirm(
          'Form submitted successfully! Press OK to go to main page.'
        )
      ) {
        navigate('/');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        alert(error.errors[0].message);
      }
    }
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (countryRef.current) {
      countryRef.current.value = value;
    }

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
    <div>
      <h1>Uncontrolled Form</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input id="name" type="text" ref={nameRef} />

        <label htmlFor="age">Age:</label>
        <input id="age" type="number" ref={ageRef} />

        <label htmlFor="email">Email:</label>
        <input id="email" type="email" ref={emailRef} />

        <label htmlFor="password">Password:</label>
        <input id="password" type="password" ref={passwordRef} />

        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input id="confirmPassword" type="password" ref={confirmPasswordRef} />

        <label htmlFor="gender">Gender:</label>
        <select id="gender" ref={genderRef}>
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label htmlFor="termsAccepted">Accept T&C:</label>
        <input id="termsAccepted" type="checkbox" ref={termsRef} />

        <label htmlFor="country">Country:</label>
        <input
          id="country"
          type="text"
          ref={countryRef}
          onChange={handleCountryChange}
          placeholder="Start typing..."
        />

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
        <input id="imageBase64" type="file" ref={imageRef} />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
