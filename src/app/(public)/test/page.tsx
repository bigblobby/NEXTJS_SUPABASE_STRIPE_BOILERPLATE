'use client';

import { Button } from '@/lib/components/ui/button';
import useTestApi from '@/lib/api/hooks/useTestApi';

export default function TestPage(){
  const { getTest } = useTestApi();
  const { data, isLoading, isFetching, refetch } = getTest(false);

  async function test() {
    void refetch();
  }

  console.log(data);

  return (
    <div>
      Test page
      <Button onClick={test}>Click</Button>
    </div>
  )
}