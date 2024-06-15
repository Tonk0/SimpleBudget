import { LuSun, LuPieChart } from 'react-icons/lu';
import { ChangeEvent, useEffect, useState } from 'react';
import moment from 'moment';
import { CSSTransition } from 'react-transition-group';
import { Link, useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import supabase from '../config/supabaseClient';
import useTags from '../hooks/useTags';
import combineTagsAndExpenses, { ExpenseRecord } from '../helpers';
import useIcons from '../hooks/useIcons';
import CreateExpense from '../components/CreateExpense';
import useDateRange, { Period } from '../hooks/useDateRange';

const buttons = ['Day', 'Week', 'Month', 'Year'];

function Main() {
  const accounts = useLocalStorage('accounts');
  const user = useLocalStorage('user');
  const iconArr = useIcons();
  const [tags, setTags] = useTags();

  const [selectedAccount, setSelectedAccount] = useState<number>(0);
  const [expensesAmount, setExpensesAmount] = useState<number>(0);
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[] | null>(null);
  const [showCreateExpense, setShowCreateExpense] = useState<boolean>(false);
  const [isExpense, setIsExpense] = useState<boolean>(true);
  const [activeButton, setActiveButton] = useState<Period>('Day');
  const dateRange = useDateRange(activeButton);
  const [refresh, setRefresh] = useState<boolean>(false);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchExpenses = async () => {
      if (user && accounts && tags.length > 0) {
        const table = isExpense ? 'expenses' : 'incomes';
        const { data, error } = await supabase.from(table)
          .select('*')
          .eq('userId', user!.id)
          .eq('accountId', accounts![selectedAccount].id)
          .gte('created_at', dateRange.gte)
          .lte('created_at', dateRange.lte)
          .order('created_at', { ascending: false });
        if (error) {
          throw Error(error.message);
        }
        setExpenseRecords(combineTagsAndExpenses(tags, data));
        if (data) {
          const expenseSum = data.reduce((accumulator, current) => accumulator + current.amount, 0);
          setExpensesAmount(expenseSum);
        }
      }
    };
    fetchExpenses();
  }, [accounts, user, selectedAccount, tags, refresh, isExpense, dateRange]);
  useEffect(() => {
    if (localStorage.getItem('accounts') === null) {
      navigate('/createBudget');
    }
  }, [navigate]);
  return (
    <div className="flex-column flex-align-center container">
      <header className="header">
        <button className="btn-clear" type="button" aria-label="theme">
          <LuSun size="32px" />
        </button>
        <div className="flex-column flex-center">
          <select
            value={selectedAccount}
            onChange={(e:ChangeEvent<HTMLSelectElement>) => setSelectedAccount(Number(e.target.value))}
          >
            {accounts?.map((el, index) => <option key={el.id} value={index}>{el.accountName}</option>)}

          </select>
          <p>{`${accounts && accounts[selectedAccount].amount} $`}</p>
        </div>
        <Link to="/analytics">
          <LuPieChart size="32px" strokeWidth="2px" />
        </Link>
      </header>
      <div className="flex-align-center" style={{ gap: '120px' }}>
        <button type="button" className="btn-clear" onClick={() => setIsExpense(true)}>
          <h2 className={isExpense ? 'border-bottom' : ''}>Expenses</h2>
        </button>
        <button type="button" className="btn-clear" onClick={() => setIsExpense(false)}>
          <h2 className={isExpense ? '' : 'border-bottom'}>Incomes</h2>
        </button>
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
      <div className="spent-amount">
        {isExpense ? <p>{`- ${expensesAmount} $`}</p> : <p>{`${expensesAmount} $`}</p>}
      </div>
      <div className="flex-column expensesInfo">
        {expenseRecords && expenseRecords.map((expense) => (
          <div className="record" key={expense.created_at}>
            <div className="flex-align-center l-side">
              {iconArr[expense.imageId]}
              <div className="expense-info">
                <p>{expense.tagName}</p>
                <p>{moment.utc(expense.created_at).format('HH:mm')}</p>
              </div>
            </div>
            <div className="r-side">
              <p>{`- ${expense.amount} $`}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="btn-clear btn-round"
        style={{ fontSize: '24px', marginTop: '8px' }}
        onClick={() => setShowCreateExpense(true)}
      >
        +
      </button>
      <CSSTransition in={showCreateExpense} timeout={450} mountOnEnter unmountOnExit classNames="flex-center wrapper">
        <CreateExpense
          setShowCreateExpense={setShowCreateExpense}
          tags={tags}
          setTags={setTags}
          accountIndex={selectedAccount}
          setRefresh={setRefresh}
          isExpense={isExpense}
        />
      </CSSTransition>
    </div>
  );
}

export default Main;
