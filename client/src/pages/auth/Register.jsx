import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useRegister } from '../../features/auth/hooks';
import { Button, Input } from '../../components/ui';

const schema = z.object({
  name: z.string().trim().min(2, 'Enter your full name'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z.string().trim().min(7, 'Enter a valid phone number').optional().or(z.literal('')),
  password: z.string().min(8, 'At least 8 characters'),
});

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate, isPending } = useRegister();
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  function onSubmit(values) {
    mutate(values, {
      onSuccess: () => {
        toast.success('Account created — check your email to verify.');
        navigate(location.state?.from || '/account');
      },
      onError: (err) => toast.error(err.response?.data?.message || 'Could not create account.'),
    });
  }

  return (
    <div>
      <h1 className="text-center font-serif text-2xl">Create Your Account</h1>
      <p className="mt-2 text-center text-sm text-grey">Join Naomi's Collections</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input label="Full Name" {...registerField('name')} error={errors.name?.message} />
        <Input label="Email" type="email" {...registerField('email')} error={errors.email?.message} />
        <Input label="Phone (optional)" {...registerField('phone')} error={errors.phone?.message} />
        <Input label="Password" type="password" {...registerField('password')} error={errors.password?.message} hint="At least 8 characters" />

        <Button type="submit" fullWidth size="lg" loading={isPending}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-grey">
        Already have an account?{' '}
        <Link to="/login" state={location.state} className="link-underline text-black">
          Log in
        </Link>
      </p>
    </div>
  );
}
