# udctl auth.md

How an AI agent gets credentials for a udctl (UnDercontrol) server and uses them.

Audience: AI agents (Claude Code, Codex, Cursor and similar) acting for a person who has
an account on a udctl server. There is no self-service agent registration: an agent
always acts with credentials its person gives it, and never creates accounts or
credentials on its own.

udctl has no OAuth or OpenID Connect authorization server, so there is no OAuth
discovery metadata, no client registration endpoint and no scopes to request. (Its
GitHub and Google sign-in buttons are a login option for people in the web app, not an
authorization server for agents.)

## Which server

udctl is self-hosted: each person or team runs its own server, so ask your person for
its URL (for example `https://ud.example.com`, or `http://localhost:8888` for the
desktop app). `https://api.oatnil.com` is a test server for trying udctl, not a hosting
plan; use it only if your person says so. All API routes live under `/api/v1` on the
server URL.

## Method 1: the ud CLI (recommended)

Install the CLI and let your person log in. `ud login` prompts for a password, so the
person runs it, not you; never ask for or handle their password.

```
npm install -g @oatnil/ud
ud login --api-url <server-url> -n <context-name>
ud config onboarding --json
```

The CLI stores the session in `~/.config/ud/config.yaml`.
After that, run `ud` commands; they authenticate for you. Full walkthrough:
https://udctl.com/agent-setup/prompt.md

## Method 2: an API key

For scripts, CI, or agents that call the HTTP API directly. Your person creates the key
in the web app (Profile, API Key Management), picks its permissions and expiry, and
gives it to you. The key starts with `ak_` and is shown only once.

API keys require a licensed deployment; the free Personal tier does not include them.
Details: https://udctl.com/docs/advanced/api-keys/

Use it with the CLI:

```
ud config set-context <context-name> --api-url <server-url> --api-key ak_...
```

or per command, without writing a config file:

```
UD_API_URL=<server-url> UD_TOKEN=ak_... ud get task
```

or on the HTTP API, as a bearer token:

```
curl -H "Authorization: Bearer ak_..." <server-url>/api/v1/tasks
```

A key can never do more than the account that created it. Deleting the key revokes it
at once.

## Using credentials

- Send every API request with `Authorization: Bearer <token>`, where the token is an
  `ak_` API key or the access token `ud login` obtained.
- A `401` means the credential is missing, expired or revoked: ask your person to run
  `ud login` again or issue a new key. Do not retry with guessed credentials.
- A `403` means the account or key lacks that permission.

## References

- API catalog: https://udctl.com/.well-known/api-catalog
- OpenAPI description: https://udctl.com/api/openapi.json
- CLI contexts and authentication: https://udctl.com/docs/cli-auth-context/
- Agent setup prompt: https://udctl.com/agent-setup/prompt.md
