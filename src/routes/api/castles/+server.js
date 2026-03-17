import pool from '$lib/server/database.js';
import { API_USER, API_PASSWORD } from '$env/static/private';

function checkAuth(request) {
    const auth = request.headers.get('Authorization');

    if (!auth || !auth.startsWith('Basic ')) {
        return false;
    }

    const base64 = auth.slice(6);
    const decoded = atob(base64);
    const [user, password] = decoded.split(':');

    return user === API_USER && password === API_PASSWORD;
}

export async function GET() {
    const [rows] = await pool.query('SELECT * FROM castles');
    return Response.json(rows);
}

export async function POST({ request }) {
    if (!checkAuth(request)) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let data;

    try {
        data = await request.json();
    } catch {
        return Response.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const { name, location, description } = data;

    if (!name || !location || !description) {
        return Response.json(
            { error: 'Name, location and description are required' },
            { status: 400 }
        );
    }

    const [result] = await pool.query(
        'INSERT INTO castles (name, location, description) VALUES (?, ?, ?)',
        [name, location, description]
    );

    return Response.json(
        {
            message: 'Castle created successfully',
            id: result.insertId
        },
        { status: 201 }
    );
}