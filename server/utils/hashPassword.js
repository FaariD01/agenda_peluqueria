const bcrypt = require('bcrypt');

const plainPasswords = ['admin', 'lucia123'];
const saltRounds = 10;

const generateHashes = async () => {
  for (const password of plainPasswords) {
    try {
      const hash = await bcrypt.hash(password, saltRounds);
      console.log(`Hash de "${password}": ${hash}`);
    } catch (err) {
      console.error(`Error al hashear "${password}":`, err);
    }
  }
};

generateHashes();
