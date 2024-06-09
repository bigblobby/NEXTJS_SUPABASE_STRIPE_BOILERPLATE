import { supabaseAdmin } from '@/lib/utils/supabase/admin';
import { User } from '@/lib/types/supabase/table.types';

async function updateUserQuery(id: string, data: Partial<User>) {
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update(data)
    .eq('id', id);

  if (updateError) {
    throw new Error(`Customer update failed: ${updateError.message}`);
  }
}

export {
  updateUserQuery,
}