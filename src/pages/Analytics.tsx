import {
  ChangeEvent, useEffect, useState,
} from 'react';
import {
  Bar, BarChart, Tooltip, XAxis, YAxis,
} from 'recharts';
import { Link } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import supabase from '../config/supabaseClient';
import { RecordsForChart, filledData } from '../helpers';
import useDateRange, { Period } from '../hooks/useDateRange';

const buttons = ['Day', 'Week', 'Month', 'Year'];

function Analytics() {
  const accounts = useLocalStorage('accounts');
  const user = useLocalStorage('user');
  const [selectedAccount, setSelectedAccount] = useState<number>(0);
  const [records, setRecords] = useState<RecordsForChart[]>([]);
  const [activeButton, setActiveButton] = useState<Period>('Day');
  const dateRange = useDateRange(activeButton);

  const [checkedExpenses, setCheckedExpenses] = useState<boolean>(true);
  const [checkedIncomes, setCheckedIncomes] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      const { data: expenseData, error: expenseError } = await supabase.from('expenses')
        .select('*')
        .eq('userId', user!.id)
        .eq('accountId', accounts![selectedAccount].id)
        .gte('created_at', dateRange.gte)
        .lte('created_at', dateRange.lte)
        .order('created_at', { ascending: false });
      if (expenseError) {
        throw Error(expenseError.message);
      }
      const { data: incomeData, error: incomeError } = await supabase.from('incomes')
        .select('*')
        .eq('userId', user!.id)
        .eq('accountId', accounts![selectedAccount].id)
        .gte('created_at', dateRange.gte)
        .lte('created_at', dateRange.lte)
        .order('created_at', { ascending: false });

      if (incomeError) {
        throw Error(incomeError.message);
      }
      setRecords(filledData(expenseData, incomeData, activeButton));
    };
    if (user && accounts) {
      fetchData();
    }
  }, [accounts, user, selectedAccount, activeButton, dateRange]);

  return (
    <div className="flex-column flex-align-center container">
      <div className="flex-center">
        <select
          value={selectedAccount}
          onChange={(e:ChangeEvent<HTMLSelectElement>) => setSelectedAccount(Number(e.target.value))}
        >
          {accounts?.map((el, index) => <option key={el.id} value={index}>{el.accountName}</option>)}
        </select>
      </div>
      <div className="flex-align-center" style={{ gap: '80px', marginTop: '36px' }}>
        {buttons.map((buttonName) => (
          <button
            key={buttonName}
            type="button"
            className={`btn-clear ${activeButton === buttonName ? 'border-bottom' : ''}`}
            onClick={() => setActiveButton(buttonName as Period)}
          >
            <h4>{buttonName}</h4>
          </button>
        ))}
      </div>
      <form className="flex-column right-form">
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <label style={{ color: 'black' }}>Expenses</label>
          <input checked={checkedExpenses} type="checkbox" onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckedExpenses(e.target.checked)} />
        </div>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
          <label style={{ color: 'black' }}>Incomes</label>
          <input checked={checkedIncomes} type="checkbox" onChange={(e: ChangeEvent<HTMLInputElement>) => setCheckedIncomes(e.target.checked)} />
        </div>
      </form>
      <div className="flex-center chart">
        <BarChart width={480} height={400} data={records}>
          <YAxis width={40} />
          <XAxis dataKey="created_at" />
          <Tooltip />
          {checkedExpenses && <Bar fill="#fd4848" dataKey="expenseAmount" />}
          {checkedIncomes && <Bar fill="#43ff43" dataKey="incomeAmount" />}
        </BarChart>
      </div>
      <Link to="/createBudget" style={{ marginRight: 'auto', marginLeft: '12px' }}>Create budget</Link>
    </div>
  );
}

export default Analytics;
