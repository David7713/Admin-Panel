// models/userModel.js

import { pool } from '../config/db.js';

export const findUserByUsername = async (email) => {
  const [rows] = await pool.execute('SELECT * FROM Users WHERE email = ?', [email]);
  return rows[0];
};

export const addUser = async (email, hashedPassword, name, surname) => {
  const [result] = await pool.execute(
    'INSERT INTO Users (email, password, name, surname) VALUES (?, ?, ?, ?)',
    [email, hashedPassword, name, surname]
  );
  return result.insertId; 
};

export const getAllUsers = async () => {
  const [rows] = await pool.execute(
    'SELECT id, email, name, surname, created_at, updated_at FROM Users'
  );
  return rows;
};

export const deleteUserById = async (id) => {
  const [result] = await pool.execute('DELETE FROM Users WHERE id = ?', [id]);
  return result;
};

export const getUserById = async (id) => {
  const [rows] = await pool.execute(
    'SELECT id, email, name, surname FROM Users WHERE id = ?',
    [id]
  );
  return rows[0];
};

export const updateUserById = async (id, { name, surname, email }) => {
  const [result] = await pool.execute(
    'UPDATE Users SET name = ?, surname = ?, email = ?,  WHERE id = ?',
    [name, surname, email, id]
  );
  return result;
};






// export const updateUserRole = async (userId, roleId) => {
//   const [result] = await pool.execute(
//       'UPDATE Users SET role_id = ? WHERE id = ?',
//       [roleId, userId]
//   );
//   return result;
// };