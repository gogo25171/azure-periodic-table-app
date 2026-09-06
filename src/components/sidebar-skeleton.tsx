'use client';

import { Sheet, SheetContent } from './ui/sheet';
import { Card, CardContent, CardHeader } from './ui/card';
import { Skeleton } from './ui/skeleton';

/**
 * Placeholder shown while `/resource/[id]` renders on the server.
 *
 * It mirrors the real sidebar layout so the panel does not jump once the data
 * arrives, and it appears immediately instead of leaving the page frozen.
 */
export default function SidebarSkeleton() {
  return (
    <Sheet open>
      <SheetContent className="sm:max-w-[720px] overflow-y-scroll">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-11 w-11 rounded" />
          <Skeleton className="h-8 w-56" />
        </div>

        {[0, 1, 2].map((card) => (
          <div className="my-6" key={card}>
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="mt-2 h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[92%]" />
                <Skeleton className="h-4 w-[70%]" />
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          </div>
        ))}
      </SheetContent>
    </Sheet>
  );
}
