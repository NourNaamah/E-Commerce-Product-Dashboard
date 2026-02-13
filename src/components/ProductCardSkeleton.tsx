export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Image Skeleton */}
      <div className="h-56 w-full bg-gray-200"></div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="h-3 w-20 bg-gray-200 rounded"></div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        {/* Rating */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-4 bg-gray-200 rounded"></div>
          ))}
        </div>

        {/* Price */}
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>

        {/* Button */}
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
