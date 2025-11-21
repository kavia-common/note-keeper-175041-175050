# Notes Backend API

## Overview
This is a minimal Express-based backend that provides a CRUD API for managing notes with file-based persistence. It includes Swagger documentation exposed at the /docs path and supports CORS configuration.

- Base URL when running locally: http://localhost:3001
- Swagger UI: http://localhost:3001/docs

## Getting Started

### Prerequisites
- Node.js 18+ recommended
- npm

### Install dependencies
```bash
cd notes_backend
npm install
```

### Environment variables
Create a .env file at notes_backend/.env to override defaults if required.

- PORT: Port for the HTTP server to listen on. Default: 3001
- HOST: Host binding. Default: 0.0.0.0
- CORS_ORIGIN: Allowed CORS origin(s). Default: *
- NOTES_DATA_FILE: File path for JSON storage of notes. Default: ./data/notes.json
- NODE_ENV: Environment name for health response. Default: development

Example .env:
```env
PORT=3001
HOST=0.0.0.0
CORS_ORIGIN=http://localhost:3000
NOTES_DATA_FILE=./data/notes.json
NODE_ENV=development
```

### Run locally
- Development (with auto-reload): npm run dev
- Production: npm start

On successful start, the server logs: Server running at http://HOST:PORT

Visit:
- Health: GET /
- Swagger: GET /docs

## API Reference

### Health
- GET /
  - 200 OK
  - Response:
    {
      "status": "ok",
      "message": "Service is healthy",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "environment": "development"
    }

### Notes
Base path: /api/notes

#### List notes
- GET /api/notes
- Query parameters:
  - q: string, optional. Search in title and content.
  - offset: integer, default 0.
  - limit: integer, default 50.
- 200 OK
- Response:
  {
    "items": [
      {
        "id": "uuid-v4",
        "title": "Note title",
        "content": "Note content",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1,
    "offset": 0,
    "limit": 50
  }

Example:
```bash
curl -s "http://localhost:3001/api/notes?q=hello&offset=0&limit=10"
```

#### Create a note
- POST /api/notes
- Request body (application/json):
  {
    "title": "My first note",
    "content": "Optional content"
  }
- 201 Created
- Response:
  {
    "id": "uuid-v4",
    "title": "My first note",
    "content": "Optional content",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
- 400 Bad Request on validation error

Example:
```bash
curl -s -X POST http://localhost:3001/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"My first note","content":"Hello"}'
```

#### Get a note
- GET /api/notes/{id}
- 200 OK
- 404 Not Found

Example:
```bash
curl -s http://localhost:3001/api/notes/<note-id>
```

#### Update a note (replace)
- PUT /api/notes/{id}
- Request body (application/json):
  {
    "title": "Updated title",
    "content": "Updated content"
  }
- 200 OK
- 400 Bad Request on validation error
- 404 Not Found

Example:
```bash
curl -s -X PUT http://localhost:3001/api/notes/<note-id> \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated title","content":"Updated content"}'
```

#### Patch a note (partial)
- PATCH /api/notes/{id}
- Request body (application/json):
  {
    "title": "Optional new title",
    "content": "Optional new content"
  }
- 200 OK
- 400 Bad Request on validation error
- 404 Not Found

Example:
```bash
curl -s -X PATCH http://localhost:3001/api/notes/<note-id> \
  -H "Content-Type: application/json" \
  -d '{"title":"New partial title"}'
```

#### Delete a note
- DELETE /api/notes/{id}
- 204 No Content
- 404 Not Found

Example:
```bash
curl -s -X DELETE http://localhost:3001/api/notes/<note-id> -i
```

## Swagger and OpenAPI
- Swagger UI is mounted at /docs and dynamically reflects the current host and protocol based on the incoming request.
- The OpenAPI schema is generated from JSDoc annotations in routes (see src/routes/*.js) via swagger-jsdoc.

Access:
- UI: http://localhost:3001/docs

## Data Persistence
Notes are stored in a JSON file managed by a simple file store with atomic writes and an in-memory cache.
- Default path: ./data/notes.json (relative to notes_backend working directory)
- Configure an alternate path via NOTES_DATA_FILE.

## Project Structure
- src/app.js: Express app initialization, CORS, Swagger UI, routes, error handler
- src/server.js: Starts the HTTP server
- src/routes/: Route definitions (including Swagger annotations)
- src/controllers/: Request handling logic
- src/services/: Business logic and file-backed storage adapter
- src/storage/fileStore.js: JSON file storage utility
- src/models/note.js: Note typedef (JSDoc)
- swagger.js: swagger-jsdoc configuration

## Running Tests and Linting
- Lint: npm run lint
- Tests: npm test (Jest is configured; add tests under a test directory if needed)

## Common Errors
- Validation errors return 400 with an error message
- Missing notes return 404 with an error message
- Unexpected errors return 500 with a generic message

## License
MIT (or project license; update as needed)
