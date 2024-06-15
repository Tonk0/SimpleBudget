import { FaArrowLeftLong } from 'react-icons/fa6';
import { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import useIcons from '../hooks/useIcons';
import { Tag } from '../types/collection';
import CreateTag from './CreateTag';

interface UserTagsProps {
  setShowUserTags: (arg:boolean) => void
  tags: Tag[]
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>
  setSelectedUserTag: (arg:Tag) => void
  isExpense: boolean
}
function UserTags({
  setShowUserTags, tags, setSelectedUserTag, setTags, isExpense,
}: UserTagsProps) {
  const iconsArr = useIcons();
  const filteredTags = tags.filter((el) => el.isExpense === isExpense);
  const handleSelect = (tag: Tag) => {
    setSelectedUserTag(tag);
    setShowUserTags(false);
  };
  const [showCreateTag, setShowCreateTag] = useState<boolean>(false);
  return (
    <>
      <div className="select-tag-wrapper" style={{ padding: '12px' }}>
        <button type="button" className="btn-clear" onClick={() => setShowUserTags(false)} aria-label="Close">
          <FaArrowLeftLong size="1.5em" />
        </button>
        <div className="created-user-tags">
          <div className="flex-column flex-center tag-container">
            <button
              type="button"
              className="btn-clear btn-round"
              style={{ fontSize: '24px' }}
              onClick={() => setShowCreateTag(true)}
            >
              +
            </button>
            <p>Create tag</p>
          </div>
          {filteredTags.map((tag) => (
            <div key={tag.id} className="flex-column flex-center tag-container">
              <button className="btn-clear btn-round flex-center" type="button" onClick={() => handleSelect(tag)}>{iconsArr[tag.icon]}</button>
              <p>{tag.name}</p>
            </div>
          ))}
        </div>
      </div>
      <CSSTransition in={showCreateTag} timeout={450} mountOnEnter unmountOnExit classNames="wrapper">
        <CreateTag setShowCreateTag={setShowCreateTag} setTags={setTags} isExpense={isExpense} />
      </CSSTransition>
    </>
  );
}

export default UserTags;
