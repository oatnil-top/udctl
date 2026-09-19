---
sidebar_position: 3
---

# License Activation Guide

How to activate a udctl self-hosted license and unlock team features.

:::tip Already have a license?
Jump to the [Quick Activation](#quick-activation) section to get started immediately.
:::

## Understanding udctl License Bands

udctl self-hosted licenses are sold in four team-size bands:

| Band | Team size | License |
|------|-----------|---------|
| **Personal** | One person | None needed — free forever |
| **Small team** | Up to 3 people | One free license for the team |
| **Team** | Up to 20 people | Paid license |
| **Unlimited** | Any team size | Paid license |

Prices are published in exactly one place: the [Pricing](/docs/pricing) page. They are not
restated here. Licenses — the paid bands and the Small team free license alike — come
through the [contact page](/contact). The [self-hosting page](/self-hosting) additionally
includes a free 3-month trial license anyone can use.

:::info Why the product says "Pro"
The license machinery inside udctl predates the current band names. A licensed
deployment is labeled **Pro** (some licenses read **Max**; the two are functionally
identical) — in the admin System Config page, in server boot logs, and throughout the
[Configuration Reference](/configuration). All licensed bands unlock the same features;
what differs between bands is how many users the license allows. Wherever the product
says "Pro", read it as "licensed".
:::

---

## Quick Activation

### Step 1: Get Your License

When your license is issued you receive two values, and both are required:

- **License token** (`LICENSE_TOKEN`) — a long signed string
- **Host secret** (`LICENSE_HOST_SECRET`) — the secret paired with that token

A token without its matching host secret does not fall back to anything: license
validation fails and the server refuses to start. Always configure the pair.

### Step 2: Add Your License

Set both values in the environment of your server, using whichever deployment method you
run (see the [Self-Deployment Guide](/docs/self-deployment) for the full setups).

**Using Docker Compose:**

1. Open your `docker-compose.yml` file
2. Add the license pair under `environment`:

```yaml
services:
  undercontrol:
    image: lintao0o0/undercontrol:latest
    environment:
      - LICENSE_TOKEN=your-license-token        # Add this line
      - LICENSE_HOST_SECRET=your-license-host-secret  # And this one
      - ADMIN_EMAIL=you@example.com
      - ADMIN_PASSWORD=change-me
    # ... rest of your configuration
```

3. Restart udctl:

```bash
docker compose up -d
```

**Using Environment Variables** (bare-metal `ud-server`):

```bash
export LICENSE_TOKEN="your-license-token"
export LICENSE_HOST_SECRET="your-license-host-secret"
export ADMIN_EMAIL="you@example.com"
```

Then restart udctl.

:::warning ADMIN_EMAIL is required on a licensed deployment
On a licensed tier the initial admin user is created from `ADMIN_EMAIL` at startup, and
the server refuses to boot without it. Personal tier ignores it. See the
[Self-Deployment Guide](/docs/self-deployment) for details.
:::

### Step 3: Verify Activation

1. Open udctl in your browser (`http://localhost:3000` with the default port mapping)
2. Log in as the admin user
3. Open the admin **System Config** page: the License section shows tier **Pro** (or
   **Max**), the expiration date, and the unlocked features

The server boot log also states the active tier at startup.

---

## What a License Unlocks

Once your license is activated:

- **Admin Dashboard** becomes available
- **User Management** features unlock — you can add users to your installation, up to
  the number your license band allows
- **Cloud Storage** options (S3, Cloudflare R2, etc.) are enabled
- **PostgreSQL** database support is available

Every licensed band unlocks the same feature set; the bands differ only in team size.

---

## Managing Your License

### Viewing License Information

To check your current license status:

1. Open udctl as an admin user
2. Go to the admin **System Config** page
3. The License section shows the tier label, customer name, issue and expiration dates,
   status (Active / Expiring Soon / Expired), and the unlocked features

### Updating Your License

To change or update your license:

1. Replace the old `LICENSE_TOKEN` / `LICENSE_HOST_SECRET` pair with the new one (use
   the same method you used for initial activation)
2. Restart udctl
3. Your new license is now active

### Removing Your License

To switch back to Personal tier:

1. Remove `LICENSE_TOKEN` and `LICENSE_HOST_SECRET` from your configuration
2. Restart udctl
3. udctl starts in Personal tier

:::warning Data Safety
Removing your license doesn't delete your data. Your tasks, notes, files, and finance
records remain in the database. However, licensed features are disabled and only one
user can access the system.
:::

---

## Troubleshooting

### Server Refuses to Start After Adding a License

**Problem:** udctl exits at startup with a license error

**Possible causes:**

- **Host secret mismatch** — the `LICENSE_HOST_SECRET` doesn't match the token, or is
  missing entirely. Configure the pair exactly as issued.
- **License has expired** — renew via the [contact page](/contact), or remove the pair
  to run in Personal tier.
- **Missing `ADMIN_EMAIL`** — required on a licensed deployment.
- **Existing Personal-tier database** — see
  [Upgrading an Existing Personal Deployment](#upgrading-an-existing-personal-deployment).

The boot log names the exact reason.

### Still Seeing Personal Tier

**Problem:** Added the license but the server runs as Personal tier

If the license pair had reached the server and been invalid, the server would not have
started at all — so a server that runs as Personal never saw your license. Check that:

1. The variables are set where the server actually reads them (e.g. in the compose
   file, not only in your shell)
2. You restarted udctl after the change
3. There are no typos — license tokens are long, copy and paste them

### Features Not Unlocking

**Problem:** License shows as active but licensed features aren't available

**Solution:**

1. Verify the license shows correctly in the admin System Config page
2. Log out and log back in
3. Clear your browser cache
4. Restart udctl completely

If issues persist, reach us via the [contact page](/contact)

---

## Upgrading an Existing Personal Deployment

Adding a license to a **fresh** deployment needs nothing beyond the steps above. But a
database that has been used on Personal tier contains the built-in personal user, and a
licensed server refuses to boot against it as a safety check.

To upgrade in place, set — for one startup — the migration switch together with the
admin credentials:

```bash
MIGRATE_FROM_PERSONAL=true
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=a-secure-password
```

This transfers all existing data to the new admin account and removes the built-in
personal user. Your tasks, notes, files, and finance records are preserved — they change
owner, not content. See the [Configuration Reference](/configuration) for the switch.

---

## Need Help?

### Contact Support

Having trouble with license activation? We're here to help!

- **Contact**: [Get in touch](/contact)
- **Documentation**: [Self-Deployment Guide](/docs/self-deployment)
- **Pricing Questions**: [Pricing Page](/docs/pricing)

### Common Questions

**Q: Do I need a separate license for development and production?**
A: A license covers one deployment. Each installation requires its own license.

**Q: Can I transfer my license to a different server?**
A: Yes. Remove the license pair from the old server and add it to the new one.

**Q: What happens when my license expires?**
A: The server refuses to start with an expired license. Renew via the
[contact page](/contact), or remove the license pair to run in Personal tier — your data
remains safe either way.

**Q: Can I get a trial license?**
A: Yes — the [self-hosting page](/self-hosting) includes a free 3-month trial license.
The Personal tier is also free forever for single-user use.

---

## Next Steps

After activating your license:

1. **Invite Users** - Add team members from the admin dashboard
2. **Configure Cloud Storage** (optional) - Set up S3 or Cloudflare R2
3. **Set Up PostgreSQL** (optional) - Switch to PostgreSQL for better performance
4. **Explore Team Features** - Set up roles and permissions

See the [Deployment Guide](/docs/self-deployment) for more configuration options.
