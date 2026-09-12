# Auth Testing Playbook — Omnivexx

## MongoDB Verification
```
mongosh
use test_database
db.users.find({role: "admin"}).pretty()
```
Verify: admin user exists, password_hash starts with `$2b$`.

## API Testing
```
API=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)
# Login -> token
TOKEN=$(curl -s -X POST "$API/api/auth/login" -H "Content-Type: application/json" -d '{"email":"admin@omnivexx.com","password":"Omnivexx@2026"}' | python3 -c "import sys,json;print(json.load(sys.stdin)['token'])")
# Protected leads with token (expect JSON array)
curl -s "$API/api/leads" -H "Authorization: Bearer $TOKEN"
# Without token (expect {"detail":"Not authenticated"})
curl -s "$API/api/leads"
# Wrong password (expect 401 {"detail":"Invalid email or password"})
curl -s -X POST "$API/api/auth/login" -H "Content-Type: application/json" -d '{"email":"admin@omnivexx.com","password":"wrong"}'
```

## Notes
- Admin is seeded on backend startup from ADMIN_EMAIL/ADMIN_PASSWORD in backend/.env. Changing the password in .env re-hashes it on next startup.
- Tokens are JWT (HS256), 12h expiry, Bearer header (no cookies).
- Public endpoints: POST /api/leads, POST /api/chat. Protected: GET /api/leads.
