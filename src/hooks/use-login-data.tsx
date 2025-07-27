import { getCookie } from '../utils/helpers';

const useLoginData = () => {
  const token = getCookie('token');

  return { token };
};

export default useLoginData;

