import express from 'express';
import { addRole, getRoles, updateRoleController, deleteRoleController, getRolePermissions, updatePermission } from '../controllers/rolesController.js';
import authorizeAndAuthenticate from '../middleware/authorizeAndAuthenticate.js';

const router = express.Router();


router.post('/roles', authorizeAndAuthenticate('/rolesCrud.html'), addRole);
router.get('/roles', authorizeAndAuthenticate('/rolesCrud.html'), getRoles);
router.put('/roles/:id', authorizeAndAuthenticate('/rolesCrud.html'), updateRoleController);
router.delete('/roles/:id', authorizeAndAuthenticate('/rolesCrud.html'), deleteRoleController);
router.get('/roles/:roleId/permissions', authorizeAndAuthenticate('/rolesCrud.html'), getRolePermissions);
router.put('/roles/permissions/:id', authorizeAndAuthenticate('/rolesCrud.html'), updatePermission);

export default router;
