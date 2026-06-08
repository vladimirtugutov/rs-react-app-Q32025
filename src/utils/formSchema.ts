import { z } from 'zod';
import { validateName, validateEmail, validateAge } from './validationUtils';

export const formSchema = z
  .object({
    name: z
      .string()
      .refine(validateName, 'Must start with an uppercase letter'),
    age: z.number().refine(validateAge, 'Must be a positive number'),
    email: z.string().refine(validateEmail, 'Invalid email'),
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

export type FormData = z.infer<typeof formSchema>;
export type FormSubmission = Omit<FormData, 'confirmPassword'> & { id: string };
