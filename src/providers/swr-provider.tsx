import { SWRConfig } from 'swr';
import type { ChildrenType } from '../types/general.types';

const SwrProvider = ({ children }: { children: ChildrenType }) => {
  return (
    <SWRConfig
      value={{
        dedupingInterval: 1000 * 60,
      }}>
      {children}
    </SWRConfig>
  );
};

export default SwrProvider;

