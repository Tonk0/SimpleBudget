import { Database } from './supabase';

export type Account = Database['public']['Tables']['accounts']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];
export type Expense = Database['public']['Tables']['expenses']['Row'];
export type Icnome = Database['public']['Tables']['incomes']['Row'];
