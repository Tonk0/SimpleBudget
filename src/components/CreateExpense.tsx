import { IoMdPricetag } from 'react-icons/io';
import { ChangeEvent, FormEvent, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Tag } from '../types/collection';
import UserTags from './UserTags';
import useIcons from '../hooks/useIcons';
import useLocalStorage from '../hooks/useLocalStorage';
import supabase from '../config/supabaseClient';

interface CreateExpenseProps {
  setShowCreateExpense: (arg:boolean) => void
  tags: Tag[]
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>
  accountIndex: number
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>
  isExpense: boolean
}

function CreateExpense({
  setShowCreateExpense, tags, setTags, accountIndex, setRefresh, isExpense,
}: CreateExpenseProps) {
  const [showUserTags, setShowUserTags] = useState<boolean>(false);
  const [selectedUserTag, setSelectedUserTag] = useState<Tag | null>(null);
  const [expenseAmount, setExpenseAmount] = useState<number>(0);
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const iconsArr = useIcons();
  const user = useLocalStorage('user');
  const accounts = useLocalStorage('accounts');
  const createExpense = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedUserTag && user && accounts) {
      const table = isExpense ? 'expenses' : 'incomes';
      const amountUpdate = isExpense ? -expenseAmount : +expenseAmount;
      const { error } = await supabase.from(table).insert({
        accountId: accounts[accountIndex].id,
        amount: expenseAmount,
        userId: user.id,
        tagId: selectedUserTag.id,
      });
      if (error) {
        throw Error(error.message);
      }
      const { error: accountError } = await supabase
        .from('accounts')
        .update({ amount: accounts[accountIndex].amount + amountUpdate })
        .eq('id', accounts[accountIndex].id);
      if (accountError) {
        throw Error(accountError.message);
      }
      setShowCreateExpense(false);
      setRefresh((prev) => !prev);
    }
    if (selectedUserTag === null) {
      setShowWarning(true);
    }
  };
  return (
    <div className="flex-center wrapper">
      <form onSubmit={createExpense} className="flex-column flex-center" style={{ gap: '12px', display: showUserTags ? 'none' : 'flex' }}>
        <input
          type="number"
          step="0.01"
          required
          style={{ textAlign: 'center', background: 'transparent' }}
          onChange={(e:ChangeEvent<HTMLInputElement>) => setExpenseAmount(Number(e.target.value))}
        />
        <button
          type="button"
          className="btn-clear flex-align-center"
          style={{ fontSize: '16px', gap: '4px' }}
          onClick={() => { setShowUserTags(true); setShowWarning(false); }}
        >
          {selectedUserTag === null ? (
            <>
              <p>select tag</p>
              <IoMdPricetag />
            </>
          ) : (
            <>
              <p>{selectedUserTag.name}</p>
              {iconsArr[selectedUserTag.icon]}
            </>
          )}
        </button>
        <div className="flex-align-center" style={{ gap: '12px' }}>
          <button type="button" className="btn btn-red" onClick={() => setShowCreateExpense(false)}>Cancel</button>
          <button type="submit" className="btn btn-green">Create</button>
        </div>
        {showWarning && <p>Select tag first</p>}
      </form>
      <CSSTransition in={showUserTags} timeout={450} mountOnEnter unmountOnExit classNames="select-tag-wrapper">
        <UserTags
          setShowUserTags={setShowUserTags}
          tags={tags}
          setSelectedUserTag={setSelectedUserTag}
          setTags={setTags}
          isExpense={isExpense}
        />
      </CSSTransition>
    </div>
  );
}

export default CreateExpense;
