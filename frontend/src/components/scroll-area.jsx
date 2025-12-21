import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from './utils';

/**
 * ScrollArea component
 */
const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root className={cn('relative', className)} {...props}>
    <ScrollAreaPrimitive.Viewport ref={ref} className="size-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollAreaPrimitive.Scrollbar orientation="vertical" className="flex touch-none select-none transition-colors p-[2px]">
      <ScrollAreaPrimitive.Thumb className="relative flex-1 rounded-full bg-border/50" />
    </ScrollAreaPrimitive.Scrollbar>
  </ScrollAreaPrimitive.Root>
));

ScrollArea.displayName = 'ScrollArea';

export { ScrollArea };
