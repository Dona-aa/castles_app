import pool from '$lib/server/database.js';
import { API_USER, API_PASSWORD } from '$env/static/private';

function checkAuth(request) {
    const auth = request.headers.get('authorization');

    if (!auth || !auth.startsWith('Basic ')) {
        return false;
    }

    const base64 = auth.split(' ')[1];
    const decoded = atob(base64);
    const [user, pass] = decoded.split(':');

    return user === API_USER && pass === API_PASSWORD;
}

export async function GET({ params }) {
    const [rows] = await pool.query('SELECT * FROM castles WHERE id = ?', [params.id]);

    if (rows.length === 0) {
        return Response.json({ message: 'Castle not found' }, { status: 404 });
    }

    return Response.json(rows[0]);
}

export async function PUT({ request, params }) {
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
        'UPDATE castles SET name = ?, location = ?, description = ? WHERE id = ?',
        [name, location, description, params.id]
    );

    if (result.affectedRows === 0) {
        return Response.json({ message: 'Castle not found' }, { status: 404 });
    }

    return Response.json({ message: 'Castle updated successfully' });
}

export async function DELETE({ request, params }) {
    if (!checkAuth(request)) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [result] = await pool.query('DELETE FROM castles WHERE id = ?', [params.id]);

    if (result.affectedRows === 0) {
        return Response.json({ message: 'Castle not found' }, { status: 404 });
    }

    return Response.json({ message: 'Castle deleted successfully' });
}