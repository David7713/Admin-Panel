import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByUsername, addUser, getAllUsers } from '../models/userModel.js';
import cookie from 'cookie';
import { deleteUserById } from '../models/userModel.js';
import { getUserById as getUserByIdModel, updateUserById } from '../models/userModel.js';


const secretKey = process.env.JWT_SECRET || 'your_secret_key';


const logTokenExpiration = (expirationTime) => {
  const expirationDate = new Date(expirationTime * 1000);
  console.log(`Token will expire at: ${expirationDate}`);
};



export const registerUser = async (req, res) => {
  const { email, password, name, surname, role_id } = req.body;

  if (!email || !password || !name || !surname || role_id === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await findUserByUsername(email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  await addUser(email, hashedPassword, name, surname, role_id);
  res.status(201).json({ message: 'User registered successfully' });
};



export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByUsername(email);
  
  if (!user) {
    return res.status(404).json({ message: 'User was not found', error: 404 });
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password', error: 401 });
  }

  const expiresIn = 604800; 
  const payload = { 
    email: user.email,
    id: user.id 
  };

  try {
    const token = jwt.sign(payload, secretKey, { expiresIn });

   
    const decodedToken = jwt.decode(token);
    console.log('Decoded JWT Payload:', decodedToken);

    res.status(200).json({ message: 'Login successful', error: 0, token: token, agencies: [] });
  } catch (err) {
    res.status(500).json({ message: 'Error generating token', error: err.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users', error: err.message });
  }
};





export const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log(id)
  if (!id) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  try {
    console.log(id)
    const result = await deleteUserById(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting 2user', error: error.message });
  }
};




export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await getUserByIdModel(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error: error.message });
  }
};




export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, surname, email, role_id } = req.body;

  if (!name || !surname || !email || role_id === undefined) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const result = await updateUserById(id, { name, surname, email, role_id });
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

