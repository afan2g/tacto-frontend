const parseFullName = (fullName) => {
  // Normalize whitespace
  const cleanName = fullName.trim().replace(/\s+/g, " ");

  // If empty or single word
  if (!cleanName || !cleanName.includes(" ")) {
    return {
      first_name: cleanName || null,
      last_name: null,
    };
  }

  // Split name into parts
  const parts = cleanName.split(" ");

  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(" "),
  };
};

export default parseFullName;
