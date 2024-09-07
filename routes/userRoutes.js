import express from 'express';
import { registerUser, loginUser, getUsers, deleteUser, updateUser, getUserById } from '../controllers/userController.js';
import authorizeAndAuthenticate from '../middleware/authorizeAndAuthenticate.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);


router.get('/users', authorizeAndAuthenticate('/usersCrud.html'), getUsers);
router.delete('/users/:id', authorizeAndAuthenticate('/usersCrud.html'), deleteUser); 
router.get('/users/:id', authorizeAndAuthenticate('/usersCrud.html'), getUserById);
router.put('/users/:id', authorizeAndAuthenticate('/usersCrud.html'), updateUser);

export default router;
 