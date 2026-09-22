import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useLogin } from '../../features/auth/hooks';
import { Button, Input } from '../../components/ui';

const schema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  function onSubmit(values) {
    mutate(values, {
      onSuccess: (user) => {
        toast.success('Welcome back.');
        const isAdmin = user.role === 'admin' || user.role === 'super-admin';
        navigate(location.state?.from || (isAdmin ? '/admin' : '/account'));
      },
      onError: (err) => toast.error(err.response?.data?.message || 'Login failed.'),
    });
  }

  return (
    <div>
      <h1 className="text-center font-serif text-2xl">Welcome Back</h1>
      <p className="mt-2 text-center text-sm text-grey">Log in to your account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
        <Input label="Password" type="password" {...register('password')} error={errors.password?.message} />

        <div className="text-right">
          <Link to="/forgot-password" className="link-underline text-xs text-grey">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth size="lg" loading={isPending}>
          Log In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-grey">
        Don't have an account?{' '}
        <Link to="/register" state={location.state} className="link-underline text-black">
          Create one
        </Link>
      </p>
    </div>
  );
}
