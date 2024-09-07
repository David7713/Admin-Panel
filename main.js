import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import authenticateToken from './middleware/authenticateToken.js'; 
import userRoutes from './routes/userRoutes.js';
import rolesRoutes from './routes/rolesRoutes.js';
import agencyRoutes from './routes/agencyRoutes.js'; // Import the agency routes
import authorizePermissions from './middleware/authorizePermissions.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3006;

app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// app.get('/users', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'users.html'));
// });

app.get('/roles', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'roles.html'));
});


// app.get('/agenciesCrud', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'agenciesCrud.html'));
// });

app.get('/agenciesCrud', authorizePermissions('/agenciesCrud.html'), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'agenciesCrud.html'));
});



app.get('/usersCrud', authorizePermissions('/usersCrud.html'), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'usersCrud.html'));
});

app.get('/rolesCrud', authorizePermissions('/rolesCrud.html'), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'rolesCrud.html'));
});



// API routes
app.use('/api', userRoutes);
app.use('/api', rolesRoutes);
app.use('/api', agencyRoutes); // Use the agency routes

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
