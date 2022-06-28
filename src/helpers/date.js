const frequencyTypeToDaysModifier = {
  days: 1,
  weeks: 7,
  months: 30,
};

const getNumberOfDays = (frequency) => {
  if (!frequencyTypeToDaysModifier[frequency.type]) {
    return 0;
  }
  return frequencyTypeToDaysModifier[frequency.type] * frequency.value;
}

export const nextTrigger = (date, frequency) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + getNumberOfDays(frequency));
  return nextDate;
}