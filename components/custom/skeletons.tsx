import { Skeleton } from "../ui/skeleton";
import { Card, CardContent } from "../ui/card";

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


export const WishlistCardSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 flex gap-4">
      <div className="relative w-16 h-24 shrink-0 overflow-hidden rounded bg-muted animate-pulse" />

      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
        <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />

        <div className="h-3 w-full bg-muted animate-pulse rounded mt-1" />

        <div className="flex gap-2 mt-auto pt-2">
          <div className="h-8 flex-1 bg-muted animate-pulse rounded" />
          <div className="h-8 w-10 bg-muted animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
};

export const WishlistPageSkeleton = () => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-7 h-7 bg-muted animate-pulse rounded-full" />
        <div className="h-10 w-64 bg-muted animate-pulse rounded-md" />
      </div>

      <div className="h-6 w-40 bg-muted animate-pulse rounded-md mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <WishlistCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};



export const ReservationCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border-border">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* Skeleton de Imagen - Proporción 2/3 */}
          <div className="w-full sm:w-32 md:w-40 aspect-2/3 sm:h-auto bg-muted animate-pulse shrink-0" />

          <div className="flex-1 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2 mb-4">
              <div className="space-y-2 flex-1">

                <div className="h-5 w-2/3 bg-muted animate-pulse rounded" />
                <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-6 w-24 bg-muted animate-pulse rounded-full" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-3 w-12 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="h-9 w-28 bg-muted animate-pulse rounded-md" />
              <div className="h-9 w-28 bg-muted animate-pulse rounded-md" />
              <div className="h-8 w-20 bg-muted animate-pulse rounded-md ml-auto" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};



export const ReservationPageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 bg-muted animate-pulse rounded-md mb-2" />

      <div className="flex justify-end py-4 gap-4 items-center">
        <div className="h-10 w-44 bg-muted animate-pulse rounded-md" />
        <div className="flex items-center gap-2">
          <div className="h-5 w-9 bg-muted animate-pulse rounded-full" />
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        </div>
      </div>

      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <ReservationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};


export const LoanCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border-white/5 bg-card">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <div className="w-full sm:w-32 md:w-40 aspect-2/3 sm:h-auto bg-muted animate-pulse shrink-0" />

          <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="space-y-2 flex-1">
                  <div className="h-6 w-3/4 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-1/4 bg-muted animate-pulse rounded" />
                </div>
                <div className="flex gap-2 shrink-0">
                  <div className="h-5 w-16 bg-muted animate-pulse rounded-md" />
                  <div className="h-5 w-24 bg-muted animate-pulse rounded-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="h-2.5 w-12 bg-muted animate-pulse rounded" />
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>

              <div className="h-4 w-1/2 bg-muted/50 animate-pulse rounded mb-4" />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-24 bg-muted animate-pulse rounded-md" />
                <div className="h-8 w-24 bg-muted animate-pulse rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const LoanPageSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="h-10 w-56 bg-muted animate-pulse rounded-md mb-2" />

      <div className="flex justify-between items-center mb-8">
        <div className="h-6 w-48 bg-muted animate-pulse rounded-md" />
        <div className="h-10 w-44 bg-muted animate-pulse rounded-md" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <LoanCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export const SubscriptionCardSkeleton = () => {
  return (
    <Card className="mb-8 border-muted/50">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="text-right space-y-1">
            <Skeleton className="h-8 w-24 ml-auto" />
            <Skeleton className="h-3 w-12 ml-auto" />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted/30 rounded-lg p-3 space-y-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-6 w-10" />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>

        <Skeleton className="h-9 w-40" />
      </CardContent>
    </Card>
  );
};

export const SubscriptionPlanCardSkeleton = () => {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5 pt-6">
        <Skeleton className="h-6 w-3/4 mb-2" />

        <div className="space-y-1 mb-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="flex items-baseline gap-1 mb-4">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-4 w-10" />
        </div>

        <div className="space-y-3 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>

        <Skeleton className="h-10 w-full rounded-md" />
      </CardContent>
    </Card>
  );
};