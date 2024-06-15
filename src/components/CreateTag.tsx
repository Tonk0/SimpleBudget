import { FormEvent, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import useIcons from '../hooks/useIcons';
import useLocalStorage from '../hooks/useLocalStorage';
import supabase from '../config/supabaseClient';
import { Tag } from '../types/collection';

interface CreateTagProps {
  setShowCreateTag: (arg:boolean) => void
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>
  isExpense: boolean
}
function CreateTag({ setShowCreateTag, setTags, isExpense }: CreateTagProps) {
  const iconsArr = useIcons();
  const user = useLocalStorage('user');

  const [showDropDownList, setShowDropDownList] = useState<boolean>(false);
  const [selectedIconKey, setSelectedIconKey] = useState<number>(0);
  const [tagName, setTagName] = useState<string>('');
  const refForTransition = useRef(null);

  const createTag = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      const { data, error } = await supabase
        .from('tags')
        .insert({
          icon: selectedIconKey, name: tagName, userId: user.id, isExpense,
        })
        .select()
        .single();
      if (error) {
        throw Error(error.message);
      }
      setTags((prev) => [...prev, data]);
      setShowCreateTag(false);
    }
  };
  return (
    <div className="flex-center wrapper">
      <form onSubmit={createTag} className="flex-column flex-center">
        <div className="flex-column form-control">
          <label htmlFor="tagName">Tag name</label>
          <input
            type="text"
            required
            name="tagName"
            id="tagName"
            style={{ background: 'transparent', width: '167px' }}
            onChange={(e:FormEvent<HTMLInputElement>) => setTagName(e.currentTarget.value)}
          />
        </div>
        {/* eslint-disable-next-line */}
          <div className="rectangle" onClick={() => setShowDropDownList(!showDropDownList)}>
            {iconsArr[selectedIconKey]}
            <CSSTransition nodeRef={refForTransition} in={showDropDownList} timeout={450} mountOnEnter unmountOnExit classNames="dropdown-list">
              <div className="dropdown">
                <div className="square" />
                <div className="dropdown-list" ref={refForTransition}>
                  <ul>
                    {iconsArr.map((el) => (
                      <button type="button" key={el.key} className="btn-clear flex-column" onClick={() => setSelectedIconKey(Number(el.key))}>
                        <li>{el}</li>
                      </button>
                    ))}
                  </ul>
                </div>
              </div>
            </CSSTransition>
          </div>
        <div className="flex-align-center" style={{ gap: '12px', marginTop: '16px' }}>
          <button type="button" className="btn btn-red" onClick={() => setShowCreateTag(false)}>Cancel</button>
          <button type="submit" className="btn btn-green">Create</button>
        </div>
      </form>
    </div>
  );
}

export default CreateTag;
