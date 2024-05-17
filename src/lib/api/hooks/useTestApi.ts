import useApi from '@/lib/api/hooks/useApi';
import { useQuery } from '@tanstack/react-query';

export default function useTestApi() {
  const { GET } = useApi();
  const URL = '/test';

  function getTest(enabled: boolean = true){
    return useQuery({
      queryKey: ['test'],
      queryFn: async () => {
        const response = await GET(URL);
        return response.data;
      },
      enabled,
    });
  }

  return {
    getTest,
  }
}