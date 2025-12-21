import * as React from 'react';
import * as CommandPrimitive from 'cmdk';
import { cn } from './utils';

/**
 * Command component
 */
const Command = React.forwardRef(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn('flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground', className)}
    {...props}
  />
));

Command.displayName = 'Command';

export { Command };
