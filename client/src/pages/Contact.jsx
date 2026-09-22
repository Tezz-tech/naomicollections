import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Phone, Instagram } from 'lucide-react';
import { api } from '../lib/axios';
import { useSettings } from '../features/settings/hooks';
import { Button, Divider, Input } from '../components/ui';
import Seo from '../components/Seo';

const schema = z.object({
  name: z.string().trim().min(2, 'Required'),
  email: z.string().trim().email('Enter a valid email'),
  subject: z.string().trim().min(2, 'Required'),
  message: z.string().trim().min(4, 'Tell us a bit more'),
});

export default function Contact() {
  const { data: settings } = useSettings();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const { mutate, isPending } = useMutation({
    mutationFn: (values) => api.post('/contact', values),
    onSuccess: (res) => {
      toast.success(res.data.message);
      reset();
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Could not send your message.'),
  });

  return (
    <div className="container-luxury py-16">
      <Seo title="Contact Us" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Divider label="Get In Touch" />
        <h1 className="mt-4 text-center font-serif text-3xl sm:text-4xl">Contact Us</h1>
      </motion.div>

      <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-12 lg:grid-cols-[280px_1fr]">
        <div className="space-y-6">
          {settings?.storeEmail && (
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-gold" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-grey">{settings.storeEmail}</p>
              </div>
            </div>
          )}
          {settings?.storePhone && (
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 text-gold" />
              <div>
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-grey">{settings.storePhone}</p>
              </div>
            </div>
          )}
          {settings?.socialLinks?.instagram && (
            <div className="flex items-start gap-3">
              <Instagram className="mt-0.5 h-4 w-4 text-gold" />
              <div>
                <p className="text-sm font-medium">Instagram</p>
                <a href={settings.socialLinks.instagram} target="_blank" rel="noreferrer" className="link-underline text-sm text-grey">
                  Follow us
                </a>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(mutate)} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Input label="Name" {...register('name')} error={errors.name?.message} />
            <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          </div>
          <Input label="Subject" {...register('subject')} error={errors.subject?.message} />
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">Message</label>
            <textarea
              {...register('message')}
              rows={5}
              className="w-full border border-grey-light px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none"
            />
            {errors.message && <p className="mt-1.5 text-xs text-status-error">{errors.message.message}</p>}
          </div>
          <Button type="submit" size="lg" loading={isPending}>Send Message</Button>
        </form>
      </div>
    </div>
  );
}
