import { useEffect, useState } from 'react';
import { Account, User } from '../types/collection';

type LocalStorageKey = 'user' | 'accounts';
type LocalStorageValue<T extends LocalStorageKey> = T extends 'user' ? User | null : T extends 'accounts' ? Account[] | null : null;

function useLocalStorage<T extends LocalStorageKey>(key: T): LocalStorageValue<T> {
  const [value, setValue] = useState<LocalStorageValue<T>>(null as LocalStorageValue<T>);
  useEffect(() => {
    const item = localStorage.getItem(key);
    if (item) {
      setValue(JSON.parse(item));
    }
  }, [key]);

  return value;
}

export default useLocalStorage;
