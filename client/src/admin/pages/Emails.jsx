import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Send, Users, RefreshCw } from 'lucide-react';
import {
  useEmailLogs,
  useComposeEmail,
  useSubscribers,
  useSendNewsletter,
  useRunAbandonedCartReminders,
} from '../../features/admin/hooks';
import { Badge, Button, Card, Input, Skeleton } from '../../components/ui';
import Pagination from '../../components/shop/Pagination';
import { formatDate } from '../../lib/format';

const TABS = ['Log', 'Compose', 'Newsletter', 'Subscribers', 'Automation'];

function ComposeTab() {
  const { register, handleSubmit, reset } = useForm();
  const { mutate, isPending } = useComposeEmail();

  function onSubmit(values) {
    mutate(values, {
      onSuccess: (res) => { toast.success(res.message); reset(); },
      onError: (err) => toast.error(err.response?.data?.message || 'Could not send email.'),
    });
  }

  return (
    <Card className="max-w-lg p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Recipient Email" type="email" {...register('to', { required: true })} />
        <Input label="Subject" {...register('subject', { required: true })} />
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">Message</label>
          <textarea {...register('message', { required: true })} rows={6} className="w-full border border-grey-light px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none" />
        </div>
        <Button type="submit" loading={isPending}><Send className="h-4 w-4" /> Send Email</Button>
      </form>
    </Card>
  );
}

function NewsletterTab() {
  const { register, handleSubmit, reset } = useForm();
  const { mutate, isPending } = useSendNewsletter();
  const { data: subscribers } = useSubscribers();

  function onSubmit(values) {
    if (!window.confirm(`Send to ${subscribers?.length || 0} subscriber(s)?`)) return;
    mutate(values, {
      onSuccess: (res) => { toast.success(res.message); reset(); },
      onError: (err) => toast.error(err.response?.data?.message || 'Could not send newsletter.'),
    });
  }

  return (
    <Card className="max-w-lg p-6">
      <p className="mb-4 flex items-center gap-2 text-xs text-grey"><Users className="h-3.5 w-3.5" /> {subscribers?.length || 0} active subscribers</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Subject" {...register('subject', { required: true })} />
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-grey">Message</label>
          <textarea {...register('message', { required: true })} rows={8} className="w-full border border-grey-light px-3.5 py-2.5 text-sm focus:border-gold focus:outline-none" />
        </div>
        <Button type="submit" loading={isPending}><Send className="h-4 w-4" /> Send Newsletter</Button>
      </form>
    </Card>
  );
}

function SubscribersTab() {
  const { data: subscribers, isLoading } = useSubscribers();
  if (isLoading) return <Skeleton className="h-64 w-full" />;
  return (
    <Card className="max-w-lg p-6">
      <ul className="divide-y divide-grey-light">
        {subscribers?.map((s) => (
          <li key={s._id} className="flex items-center justify-between py-2.5 text-sm">
            <span>{s.email}</span>
            <span className="text-xs text-grey">{formatDate(s.createdAt)}</span>
          </li>
        ))}
        {!subscribers?.length && <p className="py-4 text-sm text-grey">No subscribers yet.</p>}
      </ul>
    </Card>
  );
}

function AutomationTab() {
  const { mutate, isPending, data } = useRunAbandonedCartReminders();
  return (
    <Card className="max-w-lg p-6">
      <p className="section-label mb-2">Abandoned Checkout Reminders</p>
      <p className="mb-4 text-sm text-grey">
        Emails customers whose order was created but never paid for (1-48 hours ago). In
        production, schedule <code className="text-xs">npm run send:abandoned-cart-reminders</code> to
        run hourly via cron — this button triggers it manually.
      </p>
      <Button onClick={() => mutate()} loading={isPending}>
        <RefreshCw className="h-4 w-4" /> Run Now
      </Button>
      {data && <p className="mt-3 text-sm text-status-success">{data.message}</p>}
    </Card>
  );
}

function LogTab() {
  const [filters, setFilters] = useState({ page: 1 });
  const { data, isLoading } = useEmailLogs(filters);

  return (
    <div>
      <div className="overflow-x-auto border border-grey-light">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-offwhite text-left text-xs uppercase tracking-wide text-grey">
            <tr>
              <th className="px-4 py-3">To</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-t border-grey-light"><td className="px-4 py-3" colSpan={5}><Skeleton className="h-6 w-full" /></td></tr>
                ))
              : data?.logs?.map((log) => (
                  <tr key={log._id} className="border-t border-grey-light">
                    <td className="px-4 py-3">{log.to}</td>
                    <td className="px-4 py-3 text-grey">{log.subject}</td>
                    <td className="px-4 py-3"><Badge variant="outline">{log.type.replace(/_/g, ' ')}</Badge></td>
                    <td className="px-4 py-3"><Badge variant={log.status === 'sent' ? 'success' : 'error'}>{log.status}</Badge></td>
                    <td className="px-4 py-3 text-grey">{formatDate(log.createdAt)}</td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      <Pagination page={data?.pagination?.page || 1} pages={data?.pagination?.pages || 1} onChange={(page) => setFilters((f) => ({ ...f, page }))} />
    </div>
  );
}

export default function Emails() {
  const [tab, setTab] = useState('Log');

  return (
    <div>
      <h1 className="font-serif text-2xl">Emails</h1>

      <div className="mt-6 flex gap-6 border-b border-grey-light">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-xs uppercase tracking-widest2 transition-colors ${tab === t ? 'border-b-2 border-gold text-black' : 'text-grey hover:text-black'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === 'Log' && <LogTab />}
        {tab === 'Compose' && <ComposeTab />}
        {tab === 'Newsletter' && <NewsletterTab />}
        {tab === 'Subscribers' && <SubscribersTab />}
        {tab === 'Automation' && <AutomationTab />}
      </div>
    </div>
  );
}
