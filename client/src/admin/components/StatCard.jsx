import { Card } from '../../components/ui';

export default function StatCard({ label, value, icon: Icon, hint }) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="section-label">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-gold" />}
      </div>
      <p className="mt-3 font-serif text-2xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-grey">{hint}</p>}
    </Card>
  );
}
