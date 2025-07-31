import SwrProvider from './providers/swr-provider';
import TanstackQueryProvider from './providers/tanstack-query-provider';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/routes';

const App = () => {
  return (
    <SwrProvider>
      <TanstackQueryProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <AppRoutes />
      </TanstackQueryProvider>
    </SwrProvider>
  );
};

export default App;

