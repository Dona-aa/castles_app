import pool from '$lib/server/database.js';
import { API_USER, API_PASSWORD } from '$env/static/private';

function checkAuth(request) {
    const auth = request.headers.get('authorization');

    // Check if the request has Basic Auth
    if (!auth || !auth.startsWith('Basic ')) {
        return false;
    }

    // Get the encoded username and password
    const base64 = auth.split(' ')[1];
    const decoded = atob(base64);
    const [user, pass] = decoded.split(':');

    // Compare with the credentials from .env
    return user === API_USER && pass === API_PASSWORD;
}

export async function GET({ params }) {
    // Find the castle by its ID
    const [rows] = await pool.query('SELECT * FROM castles WHERE id = ?', [params.id]);

    // Return 404 if the castle does not exist
    if (rows.length === 0) {
        return Response.json({ message: 'Castle not found' }, { status: 404 });
    }

    // Return the found castle
    return Response.json(rows[0], { status: 200 });
}

export async function PUT({ request, params }) {
    // Stop if the user is not authorized
    if (!checkAuth(request)) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {id} = params;
    const { name, location, description } = await request.json();

    // Check if all required fields are given
    if (!name || !location || !description) {
        return Response.json(
            { error: 'Name, location and description are required' },
            { status: 400 }
        );
    }

    // Update the castle in the database
    const [result] = await pool.query(
        'UPDATE castles SET name = ?, location = ?, description = ? WHERE id = ?',
        [name, location, description, id]
    );

    // Return 404 if no castle was updated
    if (result.affectedRows === 0) {
        return Response.json({ message: 'Castle not found' }, { status: 404 });
    }

    // Return success message
    return Response.json({ message: 'Castle updated successfully' }, { status: 200 });
}

export async function DELETE({ request, params }) {
    // Stop if the user is not authorized
    if (!checkAuth(request)) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the castle by its ID
    const [result] = await pool.query('DELETE FROM castles WHERE id = ?', [params.id]);

    // Return 404 if no castle was deleted
    if (result.affectedRows === 0) {
        return Response.json({ message: 'Castle not found' }, { status: 404 });
    }

    // Return success message
    return Response.json({ message: 'Castle deleted successfully' });
}