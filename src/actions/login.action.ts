import { ActionFunctionArgs, redirect } from 'react-router-dom';
import supabase from '../config/supabaseClient';

const loginAction = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  const name = data.get('name')!.toString();

  const { data: userData, error: userError } = await supabase.from('users').select('*').eq('name', name).single();
  if (userError) {
    throw Error(userError.message);
  }
  localStorage.setItem('user', JSON.stringify(userData));
  const { data: accountsData, error: accountsError } = await supabase.from('accounts').select('*').eq('userId', userData.id);
  if (accountsError) {
    throw Error(accountsError.message);
  }
  if (accountsData.length !== 0) {
    localStorage.setItem('accounts', JSON.stringify(accountsData));
  } else {
    localStorage.removeItem('accounts');
  }
  return redirect('/main');
};

export default loginAction;
