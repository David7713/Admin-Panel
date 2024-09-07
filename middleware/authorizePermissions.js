import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const authorizePermissions = (action) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const [userRows] = await pool.query('SELECT role_id FROM users WHERE id = ?', [userId]);
      const user = userRows[0];

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const [permissionRows] = await pool.query(
        'SELECT allow FROM roles_permissions WHERE role_id = ? AND action = ?',
        [user.role_id, action]
      );

      const permission = permissionRows[0];


      if (!permission || !permission.allow) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  };
};

export default authorizePermissions;
