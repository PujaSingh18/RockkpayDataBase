const pool = require("../db");
const bcrypt = require("bcrypt");

async function getUserBalance(userId) {
  try {
    const [rows] = await pool.query(
      "SELECT balance FROM users WHERE user_id = ?",
      [userId]
    );
    if (rows.length === 0) {
      throw new Error("User balance not found");
    }
    return rows[0].balance;
  } catch (error) {
    throw new Error(`Error getting user balance: ${error.message}`);
  }
}

// Function to determine user type based on user ID prefix
function getUserTypeFromUserId(userId) {
  const userTypePrefix = userId.substring(0, 3);
  switch (userTypePrefix) {
    case "RA":
      return "Admin";
    case "RCP":
      return "Channel_Partner";
    case "RSD":
      return "Super_Distributor";
    case "RMD":
      return "Master_Distributor";
    case "RD":
      return "Distributor";
    case "RR":
      return "Retailer";
    default:
      return "Unknown";
  }
}

// Function to get all users for Admin
async function getAllUsersForAdmin() {
  try {
    // const [rows] = await db.execute('SELECT * FROM users');
    const [rows] = await pool.query("SELECT * FROM users");
    return rows.map((user) => ({
      ...user,
      user_Type: getUserTypeFromUserId(user.user_id),
    }));
  } catch (error) {
    throw new Error(`Error getting all users: ${error.message}`);
  }
}

// Function to get all channel partners for Admin
async function getAllCpForAdmin() {
  try {
    // const [rows] = await db.execute('SELECT * FROM users');
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE user_type = 'Channel_Partner'"
    );
    return rows.map((user) => ({
      ...user,
      user_Type: getUserTypeFromUserId(user.user_id),
    }));
  } catch (error) {
    throw new Error(`Error getting all CPs for Admin: ${error.message}`);
  }
}

//Function to get all Super Distributors for Admin
async function getAllSdForAdmin() {
  try {
    // const [rows] = await db.execute('SELECT * FROM users');
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE user_type = 'Super_Distributor'"
    );
    return rows.map((user) => ({
      ...user,
      user_Type: getUserTypeFromUserId(user.user_id),
    }));
  } catch (error) {
    throw new Error(`Error getting all SDs for Admin: ${error.message}`);
  }
}

// Function to get all Master Distributors for Admin
async function getAllMdForAdmin() {
  try {
    // const [rows] = await db.execute('SELECT * FROM users');
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE user_type = 'Master_Distributor'"
    );
    return rows.map((user) => ({
      ...user,
      user_Type: getUserTypeFromUserId(user.user_id),
    }));
  } catch (error) {
    throw new Error(`Error getting all MDs for Admin: ${error.message}`);
  }
}

// Function to get all Distributors for Admin
async function getAllDForAdmin() {
  try {
    // const [rows] = await db.execute('SELECT * FROM users');
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE user_type = 'Distributor'"
    );
    return rows.map((user) => ({
      ...user,
      user_Type: getUserTypeFromUserId(user.user_id),
    }));
  } catch (error) {
    throw new Error(`Error getting all Ds for Admin: ${error.message}`);
  }
}

// Function to get all Retailers for Admin
async function getAllRForAdmin() {
  try {
    // const [rows] = await db.execute('SELECT * FROM users');
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE user_type = 'Retailer'"
    );
    return rows.map((user) => ({
      ...user,
      user_Type: getUserTypeFromUserId(user.user_id),
    }));
  } catch (error) {
    throw new Error(`Error getting all Rs for Admin: ${error.message}`);
  }
}

// Function to get user by email
async function getUserByEmail(email) {
  try {
    // const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
  } catch (error) {
    throw new Error(`Error getting user by email: ${error.message}`);
  }
}

async function createUser(
  name,
  email,
  password,
  user_Type,
  parentId,
  category,
  middleName,
  lastName,
  mobileNumber,
  outletName,
  aadharcardNumber,
  gstin,
  dateOfBirth,
  bankAccountNumber,
  ifsc,
  address,
  pincode,
  district,
  state,
  city,
  alternateNumber,
  pancardNumber
) {
  try {
    let userIdPrefix = "";
    switch (user_Type) {
      case "Admin":
        userIdPrefix = "RA";
        break;
      case "Channel_Partner":
        userIdPrefix = "RCP";
        break;
      case "Super_Distributor":
        userIdPrefix = "RSD";
        break;
      case "Master_Distributor":
        userIdPrefix = "RMD";
        break;
      case "Distributor":
        userIdPrefix = "RD";
        break;
      case "Retailer":
        userIdPrefix = "RR";
        break;
      default:
        throw new Error("Invalid user type");
    }
    const userId = userIdPrefix + new Date().getTime();
    const hashedPassword = await bcrypt.hash(password, 10);
    // const [result] = await db.execute(
    const [result] = await pool.query(
      "INSERT INTO users (user_id, name, email, password, user_type, parent_id, category, middle_name, last_name, mobile_number, outlet_name, aadharcard_number, gstin, date_of_birth, bank_account_number, ifsc, address, pincode, district, state, city, alternate_number, pancard_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        name,
        email,
        hashedPassword,
        user_Type,
        parentId,
        category,
        middleName,
        lastName,
        mobileNumber,
        outletName,
        aadharcardNumber,
        gstin,
        dateOfBirth,
        bankAccountNumber,
        ifsc,
        address,
        pincode,
        district,
        state,
        city,
        alternateNumber,
        pancardNumber,
      ]
    );
    return result.insertId;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}

async function getUserById(userId) {
  try {
    // const [rows] = await db.execute('SELECT * FROM users WHERE user_id = ?', [userId]);
    const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [
      userId,
    ]);
    return rows[0];
  } catch (error) {
    throw new Error(`Error getting user by ID: ${error.message}`);
  }
}

async function getUsersUnderUser(userId, user_Type) {
  try {
    // const [rows] = await db.execute('SELECT * FROM users WHERE parent_id = ?', [userId]);
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE parent_id = ? AND user_type = ?",
      [userId, user_Type]
    );
    return rows;
  } catch (error) {
    throw new Error(`Error getting users under user: ${error.message}`);
  }
}

// async function getAllUsers(userId) {
//     try {
//         const [rows] = await db.execute('SELECT * FROM users', [userId]);
//         return rows;
//     } catch (error) {
//         throw new Error(`Error getting users under user: ${error.message}`);
//     }
// }

// Function to create a new transaction
// async function createTransaction(senderId, senderName, senderType, receiverId, receiverName, receiverType, amount, reason) {
//     try {
//         const [result] = await db.execute(
//             'INSERT INTO transactions1 (sender_id, sender_name, sender_type, receiver_id, receiver_name, receiver_type, amount, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
//             [senderId, senderName, senderType, receiverId, receiverName, receiverType, amount, reason]
//         );
//         return result.insertId;
//     } catch (error) {
//         throw new Error(`Error creating transaction: ${error.message}`);
//     }
// }

async function createTransaction(
  req,
  senderName,
  senderType,
  receiverId,
  receiverName,
  receiverType,
  amount,
  reason
) {
  let connection; // Declare connection variable outside try-catch block
  try {
    // Get the sender's user ID from the token (assuming it's stored in req.userId)
    const senderId = req.userId;
    // Start a transaction
    connection = await pool.getConnection();
    await connection.beginTransaction();
    // Insert the transaction into the database
    const [result] = await connection.query(
      "INSERT INTO transactions (sender_id, sender_name, sender_type, receiver_id, receiver_name, receiver_type, amount, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        senderId,
        senderName,
        senderType,
        receiverId,
        receiverName,
        receiverType,
        amount,
        reason,
      ]
    );
    // Update the sender's balance
    await connection.query(
      "UPDATE users SET balance = balance - ? WHERE user_id = ?",
      [amount, senderId]
    );
    // Update the receiver's balance
    await connection.query(
      "UPDATE users SET balance = balance + ? WHERE user_id = ?",
      [amount, receiverId]
    );
    // Commit the transaction
    await connection.commit();
    // Release the connection
    connection.release();
    return result.insertId;
  } catch (error) {
    // Rollback the transaction in case of an error
    if (connection) {
      await connection.rollback();
      connection.release();
    }
    throw new Error(`Error creating transaction: ${error.message}`);
  }
}

async function getAllTransactions(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM transactions");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
async function getUserTransactions(req, res) {
  try {
    const userId = req.userId;
    const [rows] = await pool.query(
      "SELECT * FROM transactions WHERE sender_id = ? OR receiver_id = ?",
      [userId, userId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getUsersUnderSignedInUser(req, res) {
  try {
    const userId = req.userId;
    // Modify the SQL query according to your database schema
    const [rows] = await pool.query(
      "SELECT user_id, name, user_type FROM users WHERE parent_id = ?",
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  getUserByEmail,
  createUser,
  getUserById,
  createTransaction,
  getUsersUnderUser,
  getAllUsersForAdmin,
  getUserBalance,
  getAllCpForAdmin,
  getAllSdForAdmin,
  getAllMdForAdmin,
  getAllDForAdmin,
  getAllRForAdmin,
  getUserTypeFromUserId,
  getAllTransactions,
  getUserTransactions,
  getUsersUnderSignedInUser,
};
