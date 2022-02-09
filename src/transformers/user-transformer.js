exports.transform = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
};
