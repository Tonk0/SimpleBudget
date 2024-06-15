import { useEffect, useState } from 'react';
import { Tag } from '../types/collection';
import useLocalStorage from './useLocalStorage';
import supabase from '../config/supabaseClient';

function useTags() : [Tag[], React.Dispatch<React.SetStateAction<Tag[]>>] {
  const [tags, setTags] = useState<Array<Tag>>([]);
  const user = useLocalStorage('user');
  useEffect(() => {
    const fetchTags = async () => {
      if (user) {
        const { data, error } = await supabase.from('tags').select('*').eq('userId', user.id);
        if (error) {
          throw Error(error.message);
        }
        setTags(data);
      }
    };
    fetchTags();
  }, [user]);
  return [tags, setTags];
}

export default useTags;
