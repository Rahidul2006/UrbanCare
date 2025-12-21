import * as React from 'react';
import { cn } from './utils';

/**
 * Separator component
 */
const Separator = React.forwardRef(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="separator"
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className
    )}
    role={decorative ? 'none' : 'separator'}
    {...props}
  />
));

Separator.displayName = 'Separator';

export { Separator };
