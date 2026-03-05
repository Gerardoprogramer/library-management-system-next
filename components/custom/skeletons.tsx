import { Skeleton } from "../ui/skeleton";

export function BookCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">

      <div className="aspect-3/4 relative">
        <Skeleton className="h-full w-full rounded-none" />

        <Skeleton className="absolute top-3 right-3 h-5 w-20 rounded-md" />

        <Skeleton className="absolute top-3 left-3 h-8 w-8 rounded-full" />
      </div>

      <div className="p-4 space-y-3">

        <Skeleton className="h-4 w-20" />

        <Skeleton className="h-5 w-3/4" />

        <Skeleton className="h-4 w-1/2" />

        <div className="flex items-center justify-between pt-2">

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-10" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BookInfoSkeleton() {
  return (
    <div>
      <div className="mb-6">
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        <div className="lg:col-span-1 space-y-4">
          <Skeleton className="aspect-3/4 w-full rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />

          <div className="flex gap-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-40" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const ReviewListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4 animate-pulse">
      
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-card border border-border rounded-lg p-5 space-y-3"
        >
          {/* Header: name + stars */}
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="h-3.5 w-3.5 rounded-sm bg-muted" />
              ))}
            </div>
          </div>

          {/* Review text */}
          <div className="space-y-2">
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-full rounded bg-muted" />
            <div className="h-3 w-4/5 rounded bg-muted" />
          </div>

          {/* Date */}
          <div className="h-3 w-24 rounded bg-muted mt-2" />
        </div>
      ))}

    </div>
  );
};

export const BookSideSkeleton = () => {
  return (
    <div className="lg:col-span-1 h-full">
      <div className="sticky top-20 space-y-4 animate-pulse">

        <div className="aspect-3/4 rounded-lg overflow-hidden border border-border shadow-xl bg-muted" />

        <div className="flex gap-2">
          <div className="flex-1 h-10 rounded-md bg-muted" />
          <div className="h-10 w-10 rounded-md bg-muted" />
        </div>

      </div>
    </div>
  );
};

export const BookMainInfoSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">

      {/* Header */}
      <div>
        {/* Genre badge */}
        <div className="h-6 w-24 rounded-md bg-muted mb-3" />

        {/* Title */}
        <div className="h-8 sm:h-10 w-3/4 rounded-md bg-muted mb-2" />

        {/* Author */}
        <div className="h-6 w-1/2 rounded-md bg-muted mb-4" />

        {/* Rating + availability */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="h-6 w-32 rounded-md bg-muted" />
          <div className="h-6 w-40 rounded-md bg-muted" />
        </div>
      </div>

      {/* Synopsis */}
      <div>
        <div className="h-6 w-28 rounded-md bg-muted mb-3" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded-md bg-muted" />
          <div className="h-4 w-full rounded-md bg-muted" />
          <div className="h-4 w-5/6 rounded-md bg-muted" />
          <div className="h-4 w-4/6 rounded-md bg-muted" />
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-lg p-4 space-y-3"
          >
            <div className="h-4 w-4 rounded bg-muted" />
            <div className="h-3 w-16 rounded bg-muted" />
            <div className="h-4 w-20 rounded bg-muted" />
          </div>
        ))}
      </div>

    </div>
  );
};