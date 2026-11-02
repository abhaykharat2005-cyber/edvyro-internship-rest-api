# API Reference
Base URL: `http://localhost:4000`

## Health
`GET /api/health`

## List internships
`GET /api/internships?page=1&limit=10&domain=Web%20Development&search=React`

Returns `items` and `pagination` (`page`, `limit`, `total`, `pages`). Limit is 1–100.

## Get one
`GET /api/internships/:id`

## Create
`POST /api/internships`
```json
{"title":"Backend Developer Intern","domain":"Full Stack Development","mode":"Remote","location":"India","skills":["Node.js","SQL"],"openings":2}
```

## Partial update
`PATCH /api/internships/:id` — send one or more supported fields.

## Delete
`DELETE /api/internships/:id`

Success envelope: `{"success":true,"data":...}`. Error envelope: `{"success":false,"error":{"code":"...","message":"..."}}`.
