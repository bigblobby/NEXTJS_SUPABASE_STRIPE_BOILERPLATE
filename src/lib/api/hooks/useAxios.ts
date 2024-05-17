import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useSession } from '@/lib/hooks/useSession';
import { getURL } from '@/lib/utils/helpers';

const axiosInstance = axios.create({
  // baseURL: `${getURL()}/api`,
  baseURL: `http://localhost:3000/api`,
});

export default function useAxios() {
  let { session, } = useSession();
  const { supabase } = useSession();

  axiosInstance.interceptors.request.clear();
  axiosInstance.interceptors.request.use(
    async (value: InternalAxiosRequestConfig) => {
      if (session?.expires_at && session.expires_at * 1000 < Date.now()) {
        // If the session is not valid, refresh it
        if (supabase) {
          const { data, error } = await supabase.auth.refreshSession();
          if (error) {
            throw error;
          }

          if (data.session) {
            session = data.session;
          }
        }
      }

      value.headers["Authorization"] = `Bearer ${session?.access_token ?? ""}`;
      return value;
    },
    (error: AxiosError) => {
      console.error({ error });
      return Promise.reject(error);
    }
  );

  return {
    axiosInstance,
  };
}