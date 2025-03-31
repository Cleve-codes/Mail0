'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useRef } from 'react';

interface ThreadSubjectProps {
  subject?: string;
}

export default function ThreadSubject({ subject }: ThreadSubjectProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const subjectContent = subject || '(no subject)';

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            ref={textRef}
            className={cn(
              'line-clamp-1 block max-w-[30ch] cursor-pointer truncate font-semibold md:max-w-[50ch]',
              !subject && 'opacity-50',
            )}
          >
            {subjectContent.trim()}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-[600px] break-words text-base">
          {subjectContent}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
