import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { api } from '../../lib/axios';
import { Button, Input } from '../ui';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const { mutate, isPending } = useMutation({
    mutationFn: (email) => api.post('/subscribers', { email }),
    onSuccess: (res) => {
      toast.success(res.data.message || 'Subscribed!');
      setEmail('');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    mutate(email.trim());
  }

  return (
    <section className="bg-black py-20 text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container-luxury text-center"
      >
        <p className="section-label !text-gold">Stay Curated</p>
        <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Join the Inner Circle</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
          Be first to know about new collections, exclusive previews, and members-only offers.
        </p>

        <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            required
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="!border-white/30 !bg-transparent !text-white placeholder:!text-white/50"
            containerClassName="flex-1"
          />
          <Button type="submit" variant="gold" loading={isPending}>
            Subscribe
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
