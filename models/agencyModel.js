import { pool } from '../config/db.js';


export const createAgency = async (name) => {
    const [result] = await pool.query(
        'INSERT INTO agencies (name) VALUES (?)',
        [name]
    );
    return result.insertId;
};

export const getAgencies = async () => {
    const [rows] = await pool.query('SELECT * FROM agencies');
    return rows;
};



export const getAgencyById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM agencies WHERE id = ?', [id]);
    return rows[0];
};



export const updateAgency = async (id, name) => {
    await pool.query('UPDATE agencies SET name = ? WHERE id = ?', [name, id]);
};

export const deleteAgency = async (agencyId) => {
    try {
        await pool.query('DELETE FROM user_agency_roles WHERE agency_id = ?', [agencyId]);
        await pool.query('DELETE FROM agencies WHERE id = ?', [agencyId]);
    } catch (err) {
        console.error('Error deleting agency:', err);
        throw err;
    }
};



export const assignUsers = async (agencyId, userRoles) => {
    try {
        await pool.query('START TRANSACTION');

        for (const { userId, roleId } of userRoles) {
            // Check if the user is already assigned to the agency
            const [existingAssignment] = await pool.query(
                'SELECT * FROM user_agency_roles WHERE user_id = ? AND agency_id = ?',
                [userId, agencyId]
            );

            if (existingAssignment.length > 0) {
                // If the user is already assigned to the agency, update the role if different
                if (existingAssignment[0].role_id !== roleId) {
                    await pool.query(
                        'UPDATE user_agency_roles SET role_id = ? WHERE user_id = ? AND agency_id = ?',
                        [roleId, userId, agencyId]
                    );

                    // Also update user's role in the Users table
                    await pool.query(
                        'UPDATE Users SET role_id = ? WHERE id = ?',
                        [roleId, userId]
                    );
                }
            } else {
                // If no existing assignment, insert a new one
                await pool.query(
                    'INSERT INTO user_agency_roles (user_id, agency_id, role_id) VALUES (?, ?, ?)',
                    [userId, agencyId, roleId]
                );

                // Update user's role in the Users table
                await pool.query(
                    'UPDATE Users SET role_id = ? WHERE id = ?',
                    [roleId, userId]
                );
            }
        }

        await pool.query('COMMIT');
    } catch (err) {
        await pool.query('ROLLBACK');
        console.error('Error assigning users:', err);
        throw err;
    }
};


export const getUsersWithRoles = async (agencyId) => {
    const [rows] = await pool.query(
        `SELECT u.id, u.name, u.surname, u.email, uar.role_id, r.title as role_title
         FROM users u
         LEFT JOIN user_agency_roles uar ON u.id = uar.user_id AND uar.agency_id = ?
         LEFT JOIN roles r ON uar.role_id = r.id
         ORDER BY u.name, u.surname`,
        [agencyId]
    );
    console.log('Rows returned from database:', rows);
    return rows;
};






