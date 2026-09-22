import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForgotPassword } from '../../features/auth/hooks';
import { Button, Input } from '../../components/ui';

const schema = z.object({ email: z.string().trim().email('Enter a valid email address') });

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const { mutate, isPending } = useForgotPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  function onSubmit(values) {
    mutate(values, { onSuccess: () => setSent(true) });
  }

  if (sent) {
    return (
      <div className="text-center">
        <h1 className="font-serif text-2xl">Check Your Email</h1>
        <p className="mt-3 text-sm text-grey">
          If that email is registered, a password reset link is on its way.
        </p>
        <Link to="/login" className="link-underline mt-6 inline-block text-sm">
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center font-serif text-2xl">Reset Your Password</h1>
      <p className="mt-2 text-center text-sm text-grey">
        Enter your email and we'll send you a reset link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Button type="submit" fullWidth size="lg" loading={isPending}>
          Send Reset Link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-grey">
        <Link to="/login" className="link-underline text-black">
          Back to Login
        </Link>
      </p>
    </div>
  );
}
