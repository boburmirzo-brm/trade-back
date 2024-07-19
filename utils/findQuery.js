exports.debtFinding = (debt) => {
  return !debt || Number(debt) === 2
    ? null
    : Number(debt) === 1
    ? { budget: { $gt: 0 } }
    : Number(debt) === -1
    ? { budget: { $lt: 0 } }
    : { budget: 0 };
};

exports.paidTodayFinding = (paidToday) => {
  const date = new Date()
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  localDate.setHours(0,0,0,0)
  let newDate = new Date(localDate.getTime() + (5 * 60 * 60 * 1000)).toISOString()
  return Number(paidToday) === 1
        ? {isPaidToday: { $gte: newDate }}
        : Number(paidToday) === -1
        ? {isPaidToday: { $lt: newDate }}
        : null
};
