const useLoginData = () => {
  const token = localStorage.getItem('token');

  return { token };
};

export default useLoginData;
