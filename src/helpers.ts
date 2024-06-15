import { Period } from './hooks/useDateRange';
import { Expense, Icnome, Tag } from './types/collection';

export type ExpenseRecord = {
  amount: number,
  tagName: string,
  imageId: number,
  created_at: string
};
export type RecordsForChart = {
  expenseAmount: number,
  incomeAmount: number,
  created_at: string,
};
export default function combineTagsAndExpenses(tags: Tag[], expenses: Expense[]) : ExpenseRecord[] {
  const tagMap = new Map<number, Tag>();
  tags.forEach((tag) => tagMap.set(tag.id, tag));

  const result: ExpenseRecord[] = expenses.map((expense) => {
    const tag = tagMap.get(expense.tagId);
    if (tag) {
      return {
        amount: expense.amount,
        tagName: tag.name,
        imageId: tag.icon,
        created_at: expense.created_at,
      };
    }
    return null;
  }).filter((item) => item !== null) as ExpenseRecord[];
  return result;
}
export function filledData(expenses: Expense[], incomes: Icnome[], period: Period) : RecordsForChart[] {
  const now = new Date();
  let filled: RecordsForChart[] = [];
  switch (period) {
    case 'Day':
      filled = new Array(24).fill(null).map((_, index) => ({
        expenseAmount: 0,
        incomeAmount: 0,
        created_at: String(index).padStart(2, '0'),
      }));
      break;
    case 'Week': {
      const startOfWeek = now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1);
      filled = new Array(7).fill(null).map((_, index) => ({
        expenseAmount: 0,
        incomeAmount: 0,
        created_at: String(startOfWeek + index).padStart(2, '0'),
      }));
      break;
    }
    case 'Month': {
      const year = now.getFullYear();
      const month = now.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      filled = new Array(daysInMonth).fill(null).map((_, index) => ({
        expenseAmount: 0,
        incomeAmount: 0,
        created_at: String(index + 1).padStart(2, '0'),
      }));
      break;
    }
    case 'Year': {
      filled = new Array(12).fill(null).map((_, index) => ({
        expenseAmount: 0,
        incomeAmount: 0,
        created_at: String(index + 1).padStart(2, '0'),
      }));
      break;
    }
    default:
      break;
  }
  expenses.forEach((expense) => {
    const expenseDate = new Date(expense.created_at);
    switch (period) {
      case 'Day': {
        const hour = expenseDate.getHours();
        filled[hour].expenseAmount += expense.amount;
        break;
      }
      case 'Week': {
        const dayOfWeek = (expenseDate.getDay() + 6) % 7;
        filled[dayOfWeek].expenseAmount += expense.amount;
        break;
      }
      case 'Month': {
        const day = expenseDate.getDate() - 1;
        filled[day].expenseAmount += expense.amount;
        break;
      }
      case 'Year': {
        const month = expenseDate.getMonth();
        filled[month].expenseAmount += expense.amount;
        break;
      }
      default:
        break;
    }
  });
  incomes.forEach((income) => {
    const incomeDate = new Date(income.created_at);
    switch (period) {
      case 'Day': {
        const hour = incomeDate.getHours();
        filled[hour].incomeAmount += income.amount;
        break;
      }
      case 'Week': {
        const dayOfWeek = (incomeDate.getDay() + 6) % 7;
        filled[dayOfWeek].incomeAmount += income.amount;
        break;
      }
      case 'Month': {
        const day = incomeDate.getDate() - 1;
        filled[day].incomeAmount += income.amount;
        break;
      }
      case 'Year': {
        const month = incomeDate.getMonth();
        filled[month].incomeAmount += income.amount;
        break;
      }
      default:
        break;
    }
  });
  return filled;
}
