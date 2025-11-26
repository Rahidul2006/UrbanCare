import * as React from 'react';
import { cn } from './utils';

/**
 * Skeleton component - placeholder for loading states
 */
const Skeleton = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
));

Skeleton.displayName = 'Skeleton';

export { Skeleton };
