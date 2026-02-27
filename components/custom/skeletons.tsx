export function BookCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      {/* Imagen */}
      <div className="aspect-3/4 bg-muted relative">
        {/* Badge skeleton */}
        <div className="absolute top-3 right-3 h-5 w-20 bg-muted-foreground/20 rounded-md" />
        {/* Wishlist skeleton */}
        <div className="absolute top-3 left-3 h-8 w-8 bg-muted-foreground/20 rounded-full" />
      </div>

      <div className="p-4">
        {/* Genre */}
        <div className="h-4 w-20 bg-muted-foreground/20 rounded mb-2" />

        {/* Title */}
        <div className="h-5 w-3/4 bg-muted-foreground/20 rounded mb-2" />

        {/* Author */}
        <div className="h-4 w-1/2 bg-muted-foreground/20 rounded mb-3" />

        <div className="flex items-center justify-between">
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted-foreground/20 rounded" />
            <div className="h-4 w-8 bg-muted-foreground/20 rounded" />
            <div className="h-4 w-10 bg-muted-foreground/20 rounded" />
          </div>

          {/* Pages */}
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-muted-foreground/20 rounded" />
            <div className="h-4 w-8 bg-muted-foreground/20 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}