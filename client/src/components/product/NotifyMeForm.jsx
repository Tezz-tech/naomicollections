import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';
import { api } from '../../lib/axios';
import { Button, Input } from '../ui';

export default function NotifyMeForm({ productId, variantSku }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post(`/products/${productId}/notify-me`, { email, variantSku }),
    onSuccess: (res) => {
      toast.success(res.data.message);
      setSent(true);
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Could not save your request.'),
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    mutate();
  }

  if (sent) {
    return (
      <p className="mt-3 flex items-center gap-2 text-xs text-status-success">
        <Bell className="h-3.5 w-3.5" /> We'll email you when it's back.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
      <Input
        type="email"
        required
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        containerClassName="flex-1"
      />
      <Button type="submit" variant="secondary" loading={isPending}>
        <Bell className="h-3.5 w-3.5" /> Notify Me
      </Button>
    </form>
  );
}
