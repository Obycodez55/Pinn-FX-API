const bcrypt = require("bcryptjs");
module.exports = async function (password) {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (error) {
    throw new Error({ error: error.message });
  }
};
