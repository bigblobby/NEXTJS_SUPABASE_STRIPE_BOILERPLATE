import { supabaseAdmin } from '@/lib/utils/supabase/admin';
import { Customer } from '@/lib/types/supabase/table.types';

async function getCustomerByIdQuery(id: string): Promise<Customer | null> {
  const { data: customer, error: customerError } =
    await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', id)
      .maybeSingle();

  if (customerError) {
    throw new Error(`Supabase customer lookup failed: ${customerError.message}`);
  }

  return customer;
}

async function getCustomerByCustomerIdQuery(customerId: string): Promise<Customer> {
  const { data: customer, error: noCustomerError } = await supabaseAdmin
    .from('customers')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single();

  if (noCustomerError) {
    throw new Error(`Customer lookup failed: ${noCustomerError.message}`);
  }

  return customer;
}

async function upsertCustomerQuery(id: string, customerId: string): Promise<string> {
  const { error } = await supabaseAdmin
    .from('customers')
    .upsert([{ id: id, stripe_customer_id: customerId }]);

  if (error) {
    throw new Error(`Supabase customer record creation failed: ${error.message}`);
  }

  return customerId;
}

async function updateCustomerByIdQuery(id: string, data: Partial<Customer>): Promise<void> {
  const { error: updateError } = await supabaseAdmin
    .from('customers')
    .update(data)
    .eq('id', id);

  if (updateError) {
    throw new Error(`Supabase customer record update failed: ${updateError.message}`);
  }
}

export {
  getCustomerByIdQuery,
  getCustomerByCustomerIdQuery,
  upsertCustomerQuery,
  updateCustomerByIdQuery,
}