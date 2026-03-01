import { useCV } from '../context/CVContext';

export const useCVData = () => {
  const cv = useCV();
  return cv;
};
