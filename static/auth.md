# udctl auth.md

Not an agent? You might be looking for https://udctl.com/docs/advanced/api-keys/.

You are an agent. This document tells you how to get a credential for a udctl
(UnDercontrol) server and how to use it. It is written for AI agents (Claude Code, Codex,
Cursor and similar) acting for a person who has an account on that server.

## Registration

Agent registration on udctl is user-delegated: an agent never registers anonymously and
never creates accounts. Your person signs in, and the credential you use is provisioned
by or for that person. Supported methods:

1. **CLI login** (recommended): your person runs `ud login`; you then work through the
   `ud` CLI.
2. **API key**: a long-lived `ak_` key, provisioned for you by your person in the web app,
   or by you through the provisioning endpoint once you hold a session.

udctl has no OAuth or OpenID Connect authorization server: there is no OAuth discovery
metadata, no dynamic client registration and no token exchange. (The GitHub and Google
buttons in the web app are sign-in options for people, not an authorization server for
agents.)

### Which server

udctl is self-hosted: each person or team runs its own server, so ask your person for
its URL (for example `https://ud.example.com`, or `http://localhost:8888` for the desktop
app). `https://api.oatnil.com` is a test server for trying udctl, not a hosting plan; use
it only if your person says so. All API routes live under `/api/v1` on the server URL.

## Method 1: CLI login

`ud login` prompts for a password, so your person runs it, not you. Never ask for or
handle their password.

```
npm install -g @oatnil/ud
ud login --api-url <server-url> -n <context-name>
ud config onboarding --json
```

The CLI stores the session in `~/.config/ud/config.yaml`; after that, `ud` commands
authenticate for you. Full walkthrough: https://udctl.com/agent-setup/prompt.md

## Method 2: API key

For scripts, CI, or calling the HTTP API directly. API keys require a licensed
deployment; the free Personal tier does not include them.

Provisioned by your person: in the web app, Profile, API Key Management, Create API Key.
They pick the permissions and expiry and give you the key. It is shown only once.

Provisioned by you, with your person's consent, while you hold a session:

```http
POST /api/v1/auth/api-keys HTTP/1.1
Host: <server-host>
Authorization: Bearer <session access token>
Content-Type: application/json

{ "name": "my-agent", "permissions": ["task:read", "task:create", "task:update"], "expiresIn": "30d" }
```

The response carries the key once; store it, do not log it. A key can never hold more
permissions than the account that created it. `GET /api/v1/auth/api-keys` lists keys and
`DELETE /api/v1/auth/api-keys/{keyId}` revokes one immediately.

## Using the credential

Every API request carries `Authorization: Bearer <token>`, where the token is an `ak_`
API key or the access token `ud login` obtained:

```
curl -H "Authorization: Bearer ak_..." <server-url>/api/v1/tasks
```

With the CLI, save a key in a context, or pass it per command:

```
ud config set-context <context-name> --api-url <server-url> --api-key ak_...
UD_API_URL=<server-url> UD_TOKEN=ak_... ud get task
```

## Errors

| Status | Meaning | What to do |
| ------ | ------- | ---------- |
| 401 | Credential missing, expired or revoked | Ask your person to run `ud login` again or issue a new key. Do not retry with guessed credentials. |
| 403 | The account or key lacks that permission | Ask your person for a key with that permission. |

## References

- API catalog: https://udctl.com/.well-known/api-catalog
- OpenAPI description: https://udctl.com/api/openapi.json
- CLI contexts and authentication: https://udctl.com/docs/cli-auth-context/
- Agent setup prompt: https://udctl.com/agent-setup/prompt.md
