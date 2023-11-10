export const calculateBlankDays = (
  year: number,
  month: number,
  {
    weekStart = 0,
  } = {}
) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const blankDays = (firstDayOfMonth + 7 - weekStart) % 7;
  return blankDays;
};

export const calculateMonthDays = (year: number, month: number) => {
  const monthDays = new Date(year, month + 1, 0).getDate();
  return monthDays;
};

export const generateWeekDays = ({
  locale = 'en-US',
  weekStart = 0
}) => {
  const weekDays = [];
  const date = new Date();
  // Find the first day of the week
  date.setDate(date.getDate() - date.getDay() + weekStart);
  // Generate week days
  for (let i = 0; i < 7; i++) {
    weekDays.push(date.toLocaleDateString(locale, { weekday: 'narrow' }));
    date.setDate(date.getDate() + 1);
  }
  return weekDays;
};
