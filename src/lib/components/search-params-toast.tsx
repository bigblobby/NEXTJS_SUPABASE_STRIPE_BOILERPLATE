'use client';

import toast from 'react-hot-toast';
import { useEffect } from 'react';

export default function SearchParamsToast({
  status,
  desc,
}: any){
  if (!status || !desc) return null;

  useEffect(() => {
    setTimeout(() => {
      toast.success(`${status} - ${desc}`, { duration: 5000 });
    }, 0);
  }, []);

  return null
}