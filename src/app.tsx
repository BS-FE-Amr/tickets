import SwrProvider from './providers/swr-provider';
import TanstackQueryProvider from './providers/tanstack-query-provider';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/routes';
import GraphQLProvider from './providers/graphql-provider';

const App = () => {
  return (
    <GraphQLProvider>
      <SwrProvider>
        <TanstackQueryProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <AppRoutes />
        </TanstackQueryProvider>
      </SwrProvider>
    </GraphQLProvider>
  );
};

export default App;

