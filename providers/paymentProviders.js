const CustomError = require("../Utils/CustomError");

function handleError(error) {
  return {
    error: { status: error.statusCode, message: error.message, error: error }
  };
}
async function depositMoney(amount, account) {
  try {
    if (account.blocked) {
      const error = new CustomError(
        "Blocked: This account is not allowed to make transactions",
        403
      );
      return handleError(error);
    } else if (amount > account.balance) {
      const error = new CustomError("Declined: Insufficient Balance", 403);
      return handleError(error);
    } else {
      account.balance -= amount;
    }
  } catch (error) {
    error = new CustomError(error.message, 500);
    return handleError(error);
  }
}

async function withdrawMoney(amount, account) {
    try {
      if (account.blocked) {
        const error = new CustomError(
          "Blocked: This account is not allowed to make transactions",
          403
        );
        return handleError(error);
      } else {
        
        account.balance += amount;
      }
    } catch (error) {
      error = new CustomError(error.message, 500);
      return handleError(error);
    }
  }

module.exports = { depositMoney, withdrawMoney };
