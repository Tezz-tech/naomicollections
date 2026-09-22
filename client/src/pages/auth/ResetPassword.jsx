import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useResetPassword } from '../../features/auth/hooks';
import { Button, Input } from '../../components/ui';

const schema = z.object({ password: z.string().min(8, 'At least 8 characters') });

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { mutate, isPending } = useResetPassword();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  if (!token) {
    return (
      <div className="text-center">
        <p className="font-serif text-xl">Invalid or missing reset link</p>
        <Link to="/forgot-password" className="link-underline mt-4 inline-block text-sm">
          Request a new link
        </Link>
      </div>
    );
  }

  function onSubmit(values) {
    mutate(
      { token, password: values.password },
      {
        onSuccess: () => {
          toast.success('Password reset — please log in.');
          navigate('/login');
        },
        onError: (err) => toast.error(err.response?.data?.message || 'Reset link is invalid or expired.'),
      }
    );
  }

  return (
    <div>
      <h1 className="text-center font-serif text-2xl">Set a New Password</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <Input label="New Password" type="password" {...register('password')} error={errors.password?.message} />
        <Button type="submit" fullWidth size="lg" loading={isPending}>
          Reset Password
        </Button>
      </form>
    </div>
  );
}
