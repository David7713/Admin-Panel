import { pool } from '../config/db.js';

export const addRoleToDatabase = async (title) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO Roles (title) VALUES (?)',
      [title]
    );
    return result.insertId;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
};


export const getAllRoles = async () => {
  try {
    const [rows] = await pool.execute('SELECT * FROM Roles');
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
};


export const updateRole = async (id, title) => {
  try {
    const [result] = await pool.execute(
      'UPDATE Roles SET title = ? WHERE id = ?',
      [title, id]
    );
    return result.affectedRows;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
};

export const deleteRole = async (id) => {
  try {
    const [result] = await pool.execute(
      'DELETE FROM Roles WHERE id = ?',
      [id]
    );
    return result.affectedRows;
  } catch (error) {
    console.error('Database Error:', error);
    throw error;
  }
};


