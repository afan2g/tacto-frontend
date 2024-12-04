const getRandomDate = (range = "seconds") => {
  const now = new Date();

  // Calculate the milliseconds for 7 days (1 week)
  const oneWeekMilliseconds = 7 * 24 * 60 * 60 * 1000;
  const oneDayMilliseconds = oneWeekMilliseconds / 7;
  const oneHourMilliseconds = oneDayMilliseconds / 24;
  const oneMinuteMilliseconds = oneHourMilliseconds / 60;
  var randomMilliseconds = Math.random() * oneMinuteMilliseconds;

  if (range === "week") {
    randomMilliseconds = Math.random() * oneWeekMilliseconds;
  } else if (range === "day") {
    randomMilliseconds = Math.random() * oneDayMilliseconds;
  } else if (range === "hour") {
    randomMilliseconds = Math.random() * oneHourMilliseconds;
  }

  // Add the random milliseconds to the current date
  const randomDate = new Date(now.getTime() - randomMilliseconds);

  return randomDate;
};

export default getRandomDate;
