import { motion } from 'framer-motion';

const EventCardSkeleton = () => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="min-w-72 bg-white dark:bg-slate-800 rounded-xl shadow-md overflow-hidden flex-shrink-0 card hover:shadow-2xl transition-shadow"
    >
      {/* Banner skeleton */}
      <figure className="relative">
        <div className="h-24 w-full bg-gray-200 dark:bg-slate-700 animate-pulse"></div>
        {/* Badge skeleton */}
        <div className="absolute -top-[100px] left-2 h-6 w-20 bg-gray-300 dark:bg-slate-600 rounded-full animate-pulse"></div>
      </figure>

      {/* Body skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-5 w-3/4 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
        
        {/* Date and time skeleton */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <div className="h-3 w-2/3 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </div>

        {/* Price skeleton */}
        <div className="h-4 w-1/4 bg-gray-300 dark:bg-slate-600 rounded animate-pulse mt-2"></div>
      </div>
    </motion.div>
  );
};

export default EventCardSkeleton;