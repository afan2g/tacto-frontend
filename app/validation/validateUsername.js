const validateUsernameClient = (username) => {
  if (!username) {
    return "Please enter a username.";
  }
  if (username.length < 3) {
    return "Username must be at least 3 characters.";
  }
  if (username.length > 20) {
    return "Username must be at most 20 characters.";
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return "Username can only contain letters, numbers, underscores, and hyphens.";
  }
  return null; // No error
};
export default validateUsernameClient;
