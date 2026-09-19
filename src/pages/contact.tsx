import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Translate, {translate} from '@docusaurus/Translate';
import Link from '@docusaurus/Link';

import styles from './butler.module.css';

/**
 * Contact page, rewritten 2026-07-28 (task c2843ed7) to speak the homepage's
 * visual language instead of its own: it now imports butler.module.css — the
 * shared landing theme — rather than a private contact.module.css, so the
 * iron law (pure monochrome, weight-and-rule hierarchy, emphasis is underline
 * + bold, no filled or inverted blocks, no icons) holds here by construction
 * and cannot drift from index.tsx. Structure mirrors the homepage: hero with
 * eyebrow → channel list → info → CTA band, with Docusaurus' own footer
 * instead of the hand-rolled one this page used to carry.
 *
 * The Telegram group is the lead channel (owner, 2026-07-28) and appears both
 * as the hero's primary CTA and first in the list. It is a permanent invite —
 * never wrap it in date-bound copy. Mirrored on the Vite app's /contact
 * (ud-vite-app/src/pages/contact-page/index.tsx); keep the two channel sets in
 * sync.
 */
const TELEGRAM_GROUP_URL = 'https://t.me/+4hZC0GtTe1syYzhl';
const EMAIL_URL = 'mailto:lintao.amons@gmail.com';
const ISSUES_URL = 'https://github.com/oatnil-top/ud-docs/issues';
const DISCUSSIONS_URL = 'https://github.com/oatnil-top/ud-docs/discussions';

type Channel = {
  key: string;
  lead?: boolean;
  title: ReactNode;
  description: ReactNode;
  linkText: ReactNode;
  href: string;
};

// Built in a hook, not at module scope, so the Translate ids stay statically
// extractable (same reason as the homepage's useSlides).
function useChannels(): Channel[] {
  return [
    {
      key: 'telegram',
      lead: true,
      title: <Translate id="contact.methods.telegram.title">Telegram Group</Translate>,
      description: (
        <Translate id="contact.methods.telegram.description">
          The liveliest room we have. Ask questions, watch what others are building, and reach the team directly.
        </Translate>
      ),
      linkText: <Translate id="contact.methods.telegram.linkText">Join the group</Translate>,
      href: TELEGRAM_GROUP_URL,
    },
    {
      key: 'email',
      title: <Translate id="contact.methods.email.title">Email</Translate>,
      description: (
        <Translate id="contact.methods.email.description">
          For general inquiries, feature requests, or business discussions. We typically respond within 24-48 hours.
        </Translate>
      ),
      linkText: <Translate id="contact.methods.email.linkText">Send Email</Translate>,
      href: EMAIL_URL,
    },
    {
      key: 'github',
      title: <Translate id="contact.methods.github.title">GitHub Issues</Translate>,
      description: (
        <Translate id="contact.methods.github.description">
          Found a bug or have a technical issue? Open an issue on GitHub for faster resolution.
        </Translate>
      ),
      linkText: <Translate id="contact.methods.github.linkText">Open Issue</Translate>,
      href: ISSUES_URL,
    },
    {
      key: 'community',
      title: <Translate id="contact.methods.community.title">Community</Translate>,
      description: (
        <Translate id="contact.methods.community.description">
          Join discussions, share ideas, and connect with other users in our GitHub Discussions.
        </Translate>
      ),
      linkText: <Translate id="contact.methods.community.linkText">Join Discussion</Translate>,
      href: DISCUSSIONS_URL,
    },
  ];
}

function HeroSection() {
  return (
    <header className={`${styles.cHero} ${styles.wrap}`}>
      <div className={styles.eyebrow}>
        <Translate id="contact.hero.eyebrow">Talk to us</Translate>
      </div>
      <h1>
        <Translate id="contact.hero.t1">Questions, bugs, ideas —</Translate>
        <br />
        <span className={styles.turn}>
          <Translate id="contact.hero.t2">we're one message away.</Translate>
        </span>
      </h1>
      <p className={styles.sub}>
        <Translate id="contact.hero.subtitle">
          We'd love to hear from you. Choose the best way to reach us.
        </Translate>
      </p>
      <div className={styles.ctas}>
        <Link className={styles.btnPrimary} href={TELEGRAM_GROUP_URL}>
          <Translate id="contact.hero.ctaTelegram">Join the Telegram group →</Translate>
        </Link>
        <Link className={styles.btnGhost} href={EMAIL_URL}>
          <Translate id="contact.hero.ctaEmail">Email us</Translate>
        </Link>
      </div>
    </header>
  );
}

function ChannelsSection() {
  const channels = useChannels();
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>
          <Translate id="contact.channels.eyebrow">Every way in</Translate>
        </div>
        <h2>
          <Translate id="contact.channels.title">Pick the room that suits you</Translate>
        </h2>
        <div className={styles.channels}>
          {channels.map((c) => (
            <div key={c.key} className={c.lead ? styles.channelLead : styles.channel}>
              <div className={styles.channelT}>{c.title}</div>
              <div className={styles.channelD}>{c.description}</div>
              <Link className={styles.channelLink} href={c.href}>
                {c.linkText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoSection() {
  return (
    <section className={styles.section}>
      <div className={styles.wrap}>
        <div className={styles.eyebrow}>
          <Translate id="contact.info.eyebrow">Good to know</Translate>
        </div>
        <h2>
          <Translate id="contact.info.title">Additional Information</Translate>
        </h2>
        <div className={styles.infoList}>
          <p>
            <Translate id="contact.info.responseTime">
              We aim to respond to all inquiries within 24-48 hours during business days.
            </Translate>
          </p>
          <p>
            <Translate id="contact.info.languages">We support English and Chinese for communication.</Translate>
          </p>
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className={styles.ctaBand}>
      <div className={styles.wrap}>
        <h2>
          <Translate id="contact.cta.title">Come say hello.</Translate>
        </h2>
        <Link className={styles.btnPrimary} href={TELEGRAM_GROUP_URL}>
          <Translate id="contact.cta.primary">Join the Telegram group</Translate>
        </Link>
        <p className={styles.fine}>
          <Translate id="contact.cta.fine">Or just email us</Translate>
        </p>
      </div>
    </section>
  );
}

export default function ContactPage(): ReactNode {
  return (
    <Layout
      title={translate({
        id: 'contact.meta.title',
        message: 'Contact Us',
        description: 'The contact page meta title',
      })}
      description={translate({
        id: 'contact.meta.description',
        message: 'Get in touch with the udctl team — Telegram group, email, or GitHub.',
        description: 'The contact page meta description',
      })}>
      <main className={styles.scope}>
        <HeroSection />
        <ChannelsSection />
        <InfoSection />
        <CtaSection />
      </main>
    </Layout>
  );
}
