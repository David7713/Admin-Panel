// middleware/authenticateToken.js
import jwt from 'jsonwebtoken';
import { getUserById } from '../models/userModel.js';

const secretKey = process.env.JWT_SECRET || 'your_secret_key';

const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (token == null) return res.status(403).json({ message: 'Forbidden', error: 403 });

  jwt.verify(token, secretKey, async (err, user) => {
    
    if (err) return res.status(403).json({ message: 'Forbidden', error: 403 });
    try {
      const userDetails = await getUserById(user.id);
      if (userDetails) {
        console.log(`User ID: ${userDetails.id}, Role ID: ${userDetails.role_id}`);
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error('Error fetching user details:', error.message);
    }
    req.user = user;
    next();
  });
};

export default authenticateToken;
