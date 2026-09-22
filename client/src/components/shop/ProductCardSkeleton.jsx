import { Skeleton } from '../ui';

export default function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[3/4] w-full" />
      <Skeleton className="mx-auto mt-3 h-4 w-3/4" />
      <Skeleton className="mx-auto mt-2 h-3 w-1/3" />
    </div>
  );
}
