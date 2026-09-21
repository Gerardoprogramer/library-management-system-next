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
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="size-5" />
            <Skeleton className="h-6 w-24" />
          </div>

          <Skeleton className="h-4 w-48" />
        </div>

        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => (
          <article key={index} className="rounded-2xl border border-border/70 bg-card p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />

                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {Array.from({
                      length: 5,
                    }).map((_, starIndex) => (
                      <Skeleton key={starIndex} className="size-4 rounded-sm" />
                    ))}
                  </div>

                  <Skeleton className="h-3 w-8" />
                </div>
              </div>

              <div className="flex gap-1">
                <Skeleton className="size-9 rounded-lg" />
                <Skeleton className="size-9 rounded-lg" />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3">
              <Skeleton className="size-3.5" />
              <Skeleton className="h-3 w-24" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export const BookSideSkeleton = () => {
  return (
    <aside className="lg:col-span-1">
      <div className="space-y-4 lg:sticky lg:top-24">
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-sm">
          <Skeleton className="aspect-3/4 w-full rounded-none" />
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-36" />
            </div>

            <Skeleton className="size-2.5 rounded-full" />
          </div>

          <div className="flex gap-2">
            <Skeleton className="h-11 flex-1 rounded-xl" />
            <Skeleton className="size-11 shrink-0 rounded-xl" />
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-muted/40 px-4 py-3">
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </aside>
  );
};

export const BookMainInfoSkeleton = () => {
  return (
    <div className="space-y-8">
      <section>
        <Skeleton className="mb-4 h-6 w-24 rounded-full" />

        <Skeleton className="h-10 w-4/5 sm:h-12 lg:h-14" />

        <Skeleton className="mt-3 h-6 w-2/5" />

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>
      </section>

      <section className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
        <Skeleton className="h-6 w-24" />

        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </section>

      <section>
        <Skeleton className="mb-4 h-6 w-36" />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-2xl border border-border/70 bg-card p-4">
              <Skeleton className="size-9 rounded-lg" />

              <Skeleton className="mt-4 h-3 w-20" />

              <Skeleton className="mt-2 h-4 w-24" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export const WishlistCardSkeleton = () => {
  return (
    <Card className="h-full overflow-hidden">
      <CardContent className="flex h-full gap-4 p-4">
        <Skeleton className="aspect-2/3 w-20 shrink-0 rounded-lg" />

        <div className="flex min-w-0 flex-1 flex-col">
          <div>
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-5 w-2/3" />

              <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
            </div>

            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-start gap-2">
              <Skeleton className="size-4 shrink-0" />

              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="size-4 shrink-0" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>

          <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-4">
            <Skeleton className="h-9 flex-1 rounded-lg" />
            <Skeleton className="size-9 rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
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
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <Skeleton className="aspect-3/4 w-full shrink-0 rounded-none sm:w-32 md:w-36" />

          <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4 sm:h-6" />
                <Skeleton className="h-4 w-1/3" />
              </div>

              <Skeleton className="h-6 w-24 shrink-0 rounded-full" />
            </div>

            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              <Skeleton className="h-4 w-56" />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
              <Skeleton className="h-9 w-36 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
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
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          <Skeleton className="aspect-3/4 w-full shrink-0 rounded-none sm:w-32 md:w-36" />

          <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4 sm:h-6" />
                <Skeleton className="h-4 w-1/3" />
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              <Skeleton className="h-4 w-48" />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border/60 pt-4">
              <Skeleton className="h-9 w-36 rounded-lg" />
              <Skeleton className="h-9 w-24 rounded-lg" />
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
    <Card className="overflow-hidden">
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            <Skeleton className="mt-2 h-4 w-28" />
          </div>

          <div className="space-y-2 lg:text-right">
            <Skeleton className="h-8 w-28 lg:ml-auto" />
            <Skeleton className="h-3 w-20 lg:ml-auto" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <Skeleton className="size-5" />
              <Skeleton className="mt-3 h-3 w-20" />
              <Skeleton className="mt-2 h-6 w-16" />
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 border-t border-border/60 pt-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-border/60 pt-5">
          <Skeleton className="h-9 w-40 rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
};

export const SubscriptionPlanCardSkeleton = () => {
  return (
    <Card className="relative h-full">
      <CardContent className="flex h-full flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <Skeleton className="h-6 w-36" />
            <Skeleton className="h-3 w-16" />
          </div>

          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="mt-5 space-y-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>

        <div className="my-6 space-y-3 border-y border-border/60 py-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="size-8 shrink-0 rounded-lg" />

              <Skeleton className="h-4 w-44" />
            </div>
          ))}
        </div>

        <Skeleton className="mt-auto h-10 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
};
