import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ChildrenType } from '../types/general.types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

const TanstackQueryProvider = ({ children }: { children: ChildrenType }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanstackQueryProvider;

