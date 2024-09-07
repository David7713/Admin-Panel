import { addRoleToDatabase } from '../models/rolesModel.js'; 
import { getAllRoles } from '../models/rolesModel.js';
import { updateRole, deleteRole } from '../models/rolesModel.js';
import { pool } from '../config/db.js'; // Import the database pool


export const addRole = async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ message: 'Role title is required' });
  }
  try {
    const roleId = await addRoleToDatabase(title);
    res.status(201).json({ message: 'Role added successfully', roleId });
  } catch (err) {
    res.status(500).json({ message: 'Error adding role', error: err.message });
  }
};



export const getRoles = async (req, res) => {
  try {
    const roles = await getAllRoles();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving roles', error: err.message });
  }
};



export const updateRoleController = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Role title is required' });
  }

  try {
    const affectedRows = await updateRole(id, title);
    if (affectedRows === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json({ message: 'Role updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating role', error: err.message });
  }
};



export const deleteRoleController = async (req, res) => {
  const { id } = req.params;

  try {
    // First, delete related permissions
    await pool.query('DELETE FROM roles_permissions WHERE role_id = ?', [id]);
    
    // Then, delete the role
    const [result] = await pool.query('DELETE FROM roles WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }

    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    console.error('Error deleting role:', err.message);
    res.status(500).json({ message: 'Error deleting role', error: err.message });
  }
};


export const getRolePermissions = async (req, res) => {
  const { roleId } = req.params;

  try {
    const [rows] = await pool.query(
      'SELECT id, action, allow FROM roles_permissions WHERE role_id = ?',
      [roleId]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    res.status(500).json({ message: 'Error fetching role permissions' });
  }
};

export const updatePermission = async (req, res) => {
  const { id } = req.params;
  const { allow } = req.body;

  if (!id || typeof allow !== 'boolean') {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE roles_permissions SET allow = ? WHERE id = ?',
      [allow, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Permission not found' });
    }

    res.json({ message: 'Permission updated successfully' });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ message: 'Error updating permission' });
  }
};