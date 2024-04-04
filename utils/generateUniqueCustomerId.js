const Customer = require("../models/customer");

async function generateUniqueCustomerId() {
  let isUnique = false;
  let uniqueId = null;

  while (!isUnique) {
    const randomId = Math.floor(1000 + Math.random() * 9000);

    // Check if this ID exists in the database
    const count = await Customer.count({ where: { customer_id: randomId } });

    if (count === 0) {
      // If the ID does not exist, it's unique, and we can use it
      uniqueId = randomId;
      isUnique = true;
    }
  }

  return uniqueId;
}

module.exports = generateUniqueCustomerId;
