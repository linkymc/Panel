# Linky

The panel for Linky, a Discord x Minecraft linking [plugin](https://github.com/linkymc/Plugin).

## API Documentation

Linky provides some APIs for implementing Linky into your own systems. Each API endpoint requires an `Authorization` header, with the instances API Key as the bearer token.
The production API url is `https://linky.astrid.sh/api`

### User API

### Fetch a user

```http
GET /users/[discord id | minecraft uuid]
```

Example response

```json
{
  "success": true,
  "isInGuild": false,
  "username": "UwUAroze",
  "uuid": "901b391a-dadb-4702-8094-7f3a557014c9",
  "discordId": "273524398483308549",
  "id": "clivoum7n000008kv3ule2lyg"
}
```

### Unlink User

```http
DELETE /users/[discord id | minecraft uuid]
```

Example response

```json
{
  "success": true
}
```

### Session API

### Fetch a session

```http
GET /sessions/[session id]
```

Example response

```json
{
  "username": "jadezinnia",
  "discordId": "714383009310048267",
  "uuid": "9179f482-4c78-4e5d-a17a-462186edcff0",
  "id": "clivp0rxr000108kv1g61gljh",
  "createdAt": "1686746047",
  "status": "pending"
}
```

## Tech

- [Prisma](https://prisma.io/)
- [Clerk](https://clerk.dev/)
- [tRPC](https://trpc.io/)
- [DaisyUI](https://daisyui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React hook form](https://npmjs.com/react-hook-form)
- [React hot toast](https://www.npmjs.com/package/react-hot-toast)
- [Radix](https://www.radix-ui.com/)
