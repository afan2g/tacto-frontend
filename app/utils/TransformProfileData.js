// utils/dataTransformers.js
export const transformProfileData = (dbProfile) => {
  if (!dbProfile) return null;

  return {
    fullName: dbProfile.full_name,
    username: `@${dbProfile.username}`,
    profilePicUrl: dbProfile.avatar_url,
    // Add any other transformations
  };
};
