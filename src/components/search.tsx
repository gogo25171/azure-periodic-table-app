import { cn } from '@/lib/utils';
import { Command, CommandInput } from './ui/command';

interface props extends React.HTMLAttributes<HTMLDivElement> {
  setTextSearch: Function;
  placeholder?: string;
}

export default function Search({
  setTextSearch,
  className,
  placeholder = 'Search resources...',
}: props) {
  return (
    <Command
      className={cn(
        'rounded-lg border w-96 flex h-12 border-input bg-background ',
        className
      )}
    >
      <CommandInput
        onValueChange={(value) => setTextSearch(value)}
        className={`bg-transparent w-96 dark:text-white text-black`}
        placeholder={placeholder}
      />
    </Command>
  );
}
