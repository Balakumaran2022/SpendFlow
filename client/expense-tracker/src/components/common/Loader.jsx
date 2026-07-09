import { Loader2 } from 'lucide-react';

export function Loader() {
  return (
    <div className="flex justify-center items-center h-full w-full py-8">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );
}
