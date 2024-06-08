import { supabaseAdmin } from '@/lib/utils/supabase/admin';
import { PaddleCustomer } from '@/lib/types/supabase/table.types';

async function getCustomerByIdQuery(id: string): Promise<PaddleCustomer | null> {
  const { data: customer, error: customerError } =
    await supabaseAdmin
      .from('paddle_customers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

  if (customerError) {
    throw new Error(`Supabase paddle customer lookup failed: ${customerError.message}`);
  }

  return customer;
}

async function getCustomerByCustomerIdQuery(customerId: string): Promise<PaddleCustomer> {
  const { data: customer, error: customerError } = await supabaseAdmin
    .from('paddle_customers')
    .select('*')
    .eq('paddle_customer_id', customerId)
    .single();

  if (customerError) {
    throw new Error(`Customer lookup failed: ${customerError.message}`);
  }

  return customer;
}

async function upsertCustomerQuery(id: string, customerId: string): Promise<string> {
  const { error } = await supabaseAdmin
    .from('paddle_customers')
    .upsert([{ id: id, paddle_customer_id: customerId }]);

  if (error) {
    throw new Error(`Supabase paddle customer record creation failed: ${error.message}`);
  }

  return customerId;
}

async function updateCustomerByIdQuery(id: string, data: Partial<PaddleCustomer>): Promise<void> {
  const { error: updateError } = await supabaseAdmin
    .from('paddle_customers')
    .update(data)
    .eq('id', id);

  if (updateError) {
    throw new Error(`Supabase paddle customer record update failed: ${updateError.message}`);
  }
}

export {
  getCustomerByIdQuery,
  getCustomerByCustomerIdQuery,
  upsertCustomerQuery,
  updateCustomerByIdQuery
}