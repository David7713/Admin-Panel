// In agencyRoutes.js
import express from 'express';
import {
    addAgency,
    listAgencies,
    getAgency,
    updateAgencyController,
    deleteAgencyController,
    assignUsersToAgency,
    getUsersByAgency,

} from '../controllers/agencyController.js';
import authorizeAndAuthenticate from '../middleware/authorizeAndAuthenticate.js';

const router = express.Router();

router.post('/agencies', authorizeAndAuthenticate('/agenciesCrud.html'), addAgency);
router.get('/agencies', authorizeAndAuthenticate('/agenciesCrud.html'), listAgencies);
router.get('/agencies/:id', authorizeAndAuthenticate('/agenciesCrud.html'), getAgency);
router.put('/agencies/:id', authorizeAndAuthenticate('/agenciesCrud.html'), updateAgencyController);
router.delete('/agencies/:id', authorizeAndAuthenticate('/agenciesCrud.html'), deleteAgencyController);
router.post('/agencies/:id/assign', authorizeAndAuthenticate('/agenciesCrud.html'), assignUsersToAgency);
router.get('/agencies/:id/users', authorizeAndAuthenticate('/agenciesCrud.html'), getUsersByAgency);

export default router;
