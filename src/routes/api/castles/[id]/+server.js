import pool from '$lib/server/database.js';
import { API_USER, API_PASS } from '$env/static/private';

function checkAuth(request) {
    const auth = request.headers.get('authorization');

    if (!auth || !auth.startsWith('Basic ')) {
        return false;
    }

    const base64 = auth.split(' ')[1];
    const decoded = atob(base64);
    const [user, pass] = decoded.split(':');

    return user === API_USER && pass === API_PASS;
}

export async function GET({ params }) {
    const id = params.id;
    const [rows] = await pool.query('SELECT * FROM castles WHERE id = ?', [id]);

    if (rows.length === 0) {
        return Response.json({ message: 'Castle not found' }, { status: 404 });
    }

    return Response.json(rows[0]);
}

export async function DELETE({ params, request }) {
    if (!checkAuth(request)) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const [result] = await pool.query('DELETE FROM castles WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
        return Response.json({ message: 'Castle not found' }, { status: 404 });
    }

    return Response.json({ message: 'Castle deleted successfully' });
}

export async function PUT({ request, params }) {
    if (!checkAuth(request)) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    const { name, location, description } = await request.json();

    const [result] = await pool.query(
        'UPDATE castles SET name = ?, location = ?, description = ? WHERE id = ?',
        [name, location, description, id]
    );

    if (result.affectedRows === 0) {
        return Response.json({ message: 'Castle not found' }, { status: 404 });
    }

    return Response.json({ message: 'Castle updated successfully' });
}