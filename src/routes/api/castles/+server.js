import pool from '$lib/server/database.js';
import { API_USER, API_PASSWORD } from '$env/static/private';

function checkAuth(request) {
    const auth = request.headers.get('Authorization');

    // Check if Basic Auth exists
    if (!auth || !auth.startsWith('Basic ')) {
        return false;
    }

    // Decode username and password
    const base64 = auth.slice(6);
    const decoded = atob(base64);
    const [user, password] = decoded.split(':');

    // Compare with .env credentials
    return user === API_USER && password === API_PASSWORD;
}

export async function GET() {
    // Get all castles from the database
    const [rows] = await pool.query('SELECT * FROM castles');

    // Return all castles as JSON
    return Response.json(rows);
}

export async function POST({ request }) {
    // Stop if the user is not authorized
    if (!checkAuth(request)) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, location, description } = await request.json();

    // Check if all fields are filled
    if (!name || !location || !description) {
        return Response.json(
            { error: 'Name, location and description are required' },
            { status: 400 }
        );
    }

    // Insert the new castle into the database
    const [result] = await pool.query(
        'INSERT INTO castles (name, location, description) VALUES (?, ?, ?)',
        [name, location, description]
    );

    // Return success message with new ID
    return Response.json(
        {
            message: 'Castle created successfully',
            id: result.insertId
        },
        { status: 201 }
    );
}