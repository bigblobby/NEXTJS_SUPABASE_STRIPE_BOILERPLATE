import { AxiosInstance, AxiosRequestConfig } from 'axios';
import useAxios from '@/lib/api/hooks/useAxios';

export default function useApi(passedInstance?: AxiosInstance) {
  const { axiosInstance } = useAxios();
  const instance = passedInstance ?? axiosInstance;

  function GET<TData>(url: string, config?: AxiosRequestConfig) {
    return instance.get<TData>(url, config);
  }

  function POST<TData>(url: string, data?: any, config?: AxiosRequestConfig) {
    return instance.post<TData>(url, data, config);
  }

  function PUT<TData>(url: string, data?: any, config?: AxiosRequestConfig) {
    return instance.put<TData>(url, data, config);
  }

  function DELETE<TData>(url: string, config?: AxiosRequestConfig) {
    return instance.delete<TData>(url, config);
  }

  return {
    GET,
    POST,
    PUT,
    DELETE,
  };
}