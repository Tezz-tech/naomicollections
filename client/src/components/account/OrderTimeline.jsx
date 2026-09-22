import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { formatDate } from '../../lib/format';

const STEPS = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderTimeline({ status, statusHistory = [] }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-3 border border-status-error/30 bg-status-error/5 p-4">
        <X className="h-5 w-5 text-status-error" />
        <div>
          <p className="text-sm font-medium text-status-error">Order Cancelled</p>
          {statusHistory.find((h) => h.status === 'cancelled')?.note && (
            <p className="text-xs text-grey">{statusHistory.find((h) => h.status === 'cancelled').note}</p>
          )}
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex flex-col gap-0 sm:flex-row sm:items-start">
      {STEPS.map((step, i) => {
        const done = i <= currentIndex;
        const historyEntry = statusHistory.find((h) => h.status === step.key);
        return (
          <div key={step.key} className="relative flex flex-1 flex-row items-start gap-3 sm:flex-col sm:items-center sm:gap-0">
            <div className="flex flex-col items-center sm:w-full">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: done ? '#0A0A0A' : '#FFFFFF',
                  borderColor: done ? '#0A0A0A' : '#E5E5E5',
                }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2"
              >
                {done ? <Check className="h-4 w-4 text-white" /> : <span className="h-2 w-2 rounded-full bg-grey-light" />}
              </motion.div>
              {i < STEPS.length - 1 && (
                <div className={`hidden h-px flex-1 sm:block sm:w-full sm:mt-4 ${i < currentIndex ? 'bg-black' : 'bg-grey-light'}`} />
              )}
            </div>
            <div className="pb-6 sm:pb-0 sm:pt-3 sm:text-center">
              <p className={`text-xs uppercase tracking-wide ${done ? 'text-black' : 'text-grey'}`}>{step.label}</p>
              {historyEntry && <p className="mt-0.5 text-[10px] text-grey">{formatDate(historyEntry.date)}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
