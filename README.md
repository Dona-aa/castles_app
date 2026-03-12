# Albania REST API - Castles

This project is a REST API built with SvelteKit and MySQL.  
It provides information about castles in Albania.

## Features

- Public GET endpoints
- Protected POST, PUT and DELETE endpoints with Basic Auth
- JSON responses only
- Correct HTTP status codes
- MySQL database integration

## Endpoints

### Public
- `GET /api/castles`
- `GET /api/castles/:id`

### Protected
- `POST /api/castles`
- `PUT /api/castles/:id`
- `DELETE /api/castles/:id`

## Example JSON object

```json
{
  "id": 1,
  "name": "Rozafa Castle",
  "location": "Shkoder",
  "description": "One of the most famous castles in Albania.",

}