import { ActionFunctionArgs, redirect } from 'react-router-dom';
import supabase from '../config/supabaseClient';
import { User } from '../types/collection';

const createAccountAction = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  const accountName = data.get('budgetName')!.toString();
  const budgetAmount = data.get('budgetAmount')!.toString();
  const item = localStorage.getItem('user');
  if (item) {
    const user: User = JSON.parse(item);
    const { error } = await supabase.from('accounts').insert({
      accountName,
      amount: Number(budgetAmount),
      userId: user.id,
    }).select();
    if (error) {
      throw Error(error.message);
    }
    const { data: accountsData, error: accountsError } = await supabase.from('accounts').select('*').eq('userId', user.id);
    if (accountsError) {
      throw Error(accountsError.message);
    }
    localStorage.setItem('accounts', JSON.stringify(accountsData));
    return redirect('/main');
  }
  return redirect('/');
};

export default createAccountAction;
