module.exports = (username) => {
  return username.replace(/[^A-Za-z0-9]/g, "") || null;
};
