import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useSession } from '@/lib/hooks/useSession';
import { getURL } from '@/lib/utils/helpers';

// If your using the NextJS api, you dont need to pass allow the authorization header
// you can instead use the createClient server side function for supabase, then get the
// authorized user that way. If you're using your own custom backend, then you'll need to
// pass this on to check if the user is logged in and authenticated. Theres no harm in keeping
// it in if your only using the NextJS api.
const axiosInstance = axios.create({
  baseURL: `${getURL()}/api`,
  // baseURL: `http://localhost:3000/api`,
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