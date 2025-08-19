import { useFormikContext } from 'formik';
import { useEffect } from 'react';

export default function Logger() {
  const { values } = useFormikContext<any>();

  useEffect(() => {
    console.log('Form values changed:', values);
  }, [values]);

  return null; // this component only logs
}

