import { useEffect, useState } from 'react';

export type Period = 'Day' | 'Week' | 'Month' | 'Year';
interface DateRange {
  gte: string
  lte: string
}
function useDateRange(period: Period): DateRange {
  const [dateRange, setDateRange] = useState<DateRange>({ gte: '', lte: '' });
  useEffect(() => {
    const now = new Date();
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    switch (period) {
      case 'Day':
        break;
      case 'Week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'Month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'Year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        break;
    }
    setDateRange({ gte: startDate.toISOString(), lte: now.toISOString() });
  }, [period]);
  return dateRange;
}

export default useDateRange;
