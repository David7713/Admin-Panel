// In agencyController.js
import {
    createAgency,
    getAgencies,
    getAgencyById,
    updateAgency,
    deleteAgency,
    assignUsers,
    getUsersWithRoles,

} from '../models/agencyModel.js';
import authorizeAndAuthenticate from '../middleware/authorizeAndAuthenticate.js';

export const addAgency = async (req, res) => {
    try {
        const { name } = req.body;
        const id = await createAgency(name);
        res.status(201).json({ id, name });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create agency' });
    }
};

export const listAgencies = async (req, res) => {
    try {
        const agencies = await getAgencies();
        res.status(200).json(agencies);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve agencies' });
    }
};

export const getAgency = async (req, res) => {
    try {
        const { id } = req.params;
        const agency = await getAgencyById(id);
        if (agency) {
            res.status(200).json(agency);
        } else {
            res.status(404).json({ error: 'Agency not found' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve agency' });
    }
};

export const updateAgencyController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        await updateAgency(id, name);
        res.status(200).json({ message: 'Agency updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update agency' });
    }
};

export const deleteAgencyController = async (req, res) => {
    try {
        const { id } = req.params;
        await deleteAgency(id);
        res.status(200).json({ message: 'Agency deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete agency' });
    }
};

export const assignUsersToAgency = async (req, res) => {
    try {
        const { id } = req.params;
        const { userRoles } = req.body; 
        await assignUsers(id, userRoles);
        res.status(200).json({ message: 'Users assigned successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to assign users' });
    }
};

export const getUsersByAgency = async (req, res) => {
    try {
        const { id } = req.params;
        const users = await getUsersWithRoles(id);
        console.log('Users fetched for agency:', users); // Add this line
        if (users.length > 0) {
            res.status(200).json(users);
        } else {
            res.status(404).json({ error: 'No users found for this agency' });
        }
    } catch (err) {
        console.error('Error in getUsersByAgency:', err); // Add this line
        res.status(500).json({ error: 'Failed to retrieve users' });
    }
};











