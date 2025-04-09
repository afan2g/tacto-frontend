const formatRelativeTime = (dateString, locale = null) => {
  const now = new Date();
  const date = new Date(dateString);
  if (locale) {
    return date.toLocaleString(locale.languageTag, {
      timeZone: locale.timeZone,
      dateStyle: "long",
      timeStyle: "short",
    });
  }
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    return date.toLocaleDateString();
  }
};

export default formatRelativeTime;
