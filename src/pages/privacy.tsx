import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Translate, {translate} from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import {
  Shield,
  Heart,
  Monitor,
  Database,
  Server,
  Mail,
  Smartphone,
  Share2,
  Trash2,
} from 'lucide-react';

import styles from './privacy.module.css';

function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroIcon}>
        <Shield size={24} strokeWidth={2} />
      </div>
      <h1 className={styles.heroTitle}>
        <Translate id="privacy.title">Privacy Policy</Translate>
      </h1>
      <p className={styles.heroSubtitle}>
        <Translate id="privacy.subtitle">
          An honest take on data privacy from an indie developer
        </Translate>
      </p>
      <p className={styles.heroDate}>
        <Translate id="privacy.lastUpdated">Last updated: August 2026</Translate>
      </p>
    </section>
  );
}

interface PolicySectionProps {
  icon: ReactNode;
  titleId: string;
  titleDefault: string;
  paragraphs: ReactNode[];
}

function PolicySection({icon, titleId, titleDefault, paragraphs}: PolicySectionProps) {
  return (
    <div className={styles.policySection}>
      <div className={styles.policySectionInner}>
        <div className={styles.policySectionIcon}>{icon}</div>
        <div className={styles.policySectionBody}>
          <h2 className={styles.policySectionTitle}>
            <Translate id={titleId}>{titleDefault}</Translate>
          </h2>
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.policySectionText}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

function PolicyContent() {
  return (
    <section className={styles.policyContent}>
      <PolicySection
        icon={<Heart size={20} strokeWidth={2} />}
        titleId="privacy.sections.honestTake.title"
        titleDefault="An Honest Take"
        paragraphs={[
          <Translate key="p1" id="privacy.sections.honestTake.p1">
            {"I'm an indie developer, not a big corporation. One of my main motivations for building udctl was that I wanted full control over my own sensitive data — tasks, finances, personal notes — instead of handing them to big tech companies. I built this for myself first, and now I'm sharing it with you."}
          </Translate>,
          <Translate key="p2" id="privacy.sections.honestTake.p2">
            {"I have zero interest, ability, resources, or motivation to do anything with your data. That said, I understand if you don't fully trust me — you shouldn't blindly trust anyone online. Big companies with entire security teams still get breached. So why would you trust a solo developer? You have every right to be skeptical."}
          </Translate>,
        ]}
      />

      <PolicySection
        icon={<Monitor size={20} strokeWidth={2} />}
        titleId="privacy.sections.yourChoices.title"
        titleDefault="Your Choices"
        paragraphs={[
          <span key="p1">
            <Translate id="privacy.sections.yourChoices.p1_before">
              {"That's why I give you options. You don't have to use our cloud service. You can use the Desktop App — "}
            </Translate>
            <strong className={styles.highlight}>
              <Translate id="privacy.sections.yourChoices.p1_highlight">
                your data stays 100% on your device, never touches any server. Or you can Self-Host — run your own instance, full control, your infrastructure.
              </Translate>
            </strong>
          </span>,
          <Translate key="p2" id="privacy.sections.yourChoices.p2">
            {"The cloud service exists for convenience, not because I want your data. If privacy is your priority, go local or self-host. No hard feelings."}
          </Translate>,
        ]}
      />

      <PolicySection
        icon={<Smartphone size={20} strokeWidth={2} />}
        titleId="privacy.sections.appliesTo.title"
        titleDefault="Where This Policy Applies"
        paragraphs={[
          <Translate key="p1" id="privacy.sections.appliesTo.p1">
            {"This policy covers everything that carries the udctl name: this website, the web app, the desktop app, the command-line tool, and the mobile app for iOS distributed through the App Store and TestFlight. Where a section below says \u201cthe cloud service\u201d, it means the hosted backend the apps talk to by default \u2014 not the desktop app running locally, and not an instance you host yourself."}
          </Translate>,
          <Translate key="p2" id="privacy.sections.appliesTo.p2">
            {"If you use the mobile app against our hosted backend, everything below \u2014 what is collected, who else processes it, how long it is kept, and how to delete it \u2014 applies to you."}
          </Translate>,
        ]}
      />

      <PolicySection
        icon={<Database size={20} strokeWidth={2} />}
        titleId="privacy.sections.whatWeCollect.title"
        titleDefault="What's Saved on the Server"
        paragraphs={[
          <Translate key="p1" id="privacy.sections.whatWeCollect.p1">
            {"If you use our cloud service: account info (email, username) and the data you create — tasks, expenses, budgets, etc. I promise I won't look into your data, but you don't need to trust me."}
          </Translate>,
          <Translate key="p3" id="privacy.sections.whatWeCollect.p3">
            {"Concretely, the cloud service holds four kinds of data. Contact info \u2014 your email address, used to sign you in and to reach you. Identifiers \u2014 the user ID that ties your rows together. User content \u2014 the tasks, notes, comments and chat messages you write, plus any files, images or documents you upload. Financial info \u2014 the expenses, incomes, accounts, budgets and possessions you enter, if you use the finance features."}
          </Translate>,
          <Translate key="p4" id="privacy.sections.whatWeCollect.p4">
            {"What it does not hold: no advertising or tracking identifiers, no device or crash diagnostics, no location, no contacts, no health data. The mobile, desktop and web apps contain no analytics, crash-reporting or attribution SDK. Voice input is turned into text before it leaves the app \u2014 no audio recording is uploaded to us. In-app purchases are verified locally on your device, so we never receive a receipt."}
          </Translate>,
          <strong key="p2" className={styles.highlight}>
            <Translate id="privacy.sections.whatWeCollect.p2_highlight">
              Choose desktop app or self-host to fully control your data
            </Translate>
          </strong>,
        ]}
      />

      <PolicySection
        icon={<Share2 size={20} strokeWidth={2} />}
        titleId="privacy.sections.thirdParties.title"
        titleDefault="Who Else Processes Your Data"
        paragraphs={[
          <Translate key="p1" id="privacy.sections.thirdParties.p1">
            {"AI features send content to a model provider. When you use the built-in assistant, or an AI action on a task, a note or an image, the text you submit and the item it acts on are sent to a large-language-model provider so it can answer. Which provider depends on configuration: the cloud service uses a provider configured on the server (an OpenAI- or Anthropic-compatible API), and you can point the app at your own provider instead. We do not use your content to train any model; what a provider does with what it receives is governed by that provider\u2019s own terms. If that matters to you, configure your own provider, or use the desktop app or a self-hosted instance."}
          </Translate>,
          <Translate key="p2" id="privacy.sections.thirdParties.p2">
            {"This website uses Google Analytics. oatnil.com \u2014 the marketing and documentation site you are reading this on \u2014 loads Google Analytics (measurement ID G-B3E5P48S9Y) with IP anonymisation enabled, to count page views. The apps do not load it, and there is no advertising or cross-site tracking anywhere."}
          </Translate>,
          <Translate key="p3" id="privacy.sections.thirdParties.p3">
            {"Infrastructure. The site and the API are served through Cloudflare, and the backend runs on a rented server with a managed Postgres database and S3-compatible object storage. Those providers process data in transit and at rest the way any host does. Apart from them and the model provider above, we do not share your data with anyone, and we do not sell it."}
          </Translate>,
        ]}
      />

      <PolicySection
        icon={<Trash2 size={20} strokeWidth={2} />}
        titleId="privacy.sections.retention.title"
        titleDefault="How Long We Keep It, and How to Delete It"
        paragraphs={[
          <Translate key="p1" id="privacy.sections.retention.p1">
            {"While your account exists, we keep what you put in it \u2014 there is no automatic expiry, and nothing is deleted behind your back."}
          </Translate>,
          /*
            Canonical wording. Single source of truth is the "\u5220\u53f7\u771f\u5b9e\u884c\u4e3a" section of epic e85f4147;
            this page and the App Store Connect privacy answers must carry it word for word.
            The earlier draft said "removes the account and all content it owns" \u2014 literally true
            but misleading: a comment's owner_id is the owner of the CARD it sits on, not its author
            (todolist.NewComment takes the task's Ownership; the author only lands in created_by),
            so comments left on other people's cards survive deletion and merely lose the display
            name. Do not reword without changing the epic first.
          */
          <Translate key="p1b" id="privacy.sections.retention.p1b">
            {"Deleting your account permanently removes your account, everything it owns, and your uploaded files. Comments you left on other people's cards remain part of those conversations, no longer attributed to you. Security audit records are retained for up to 30 days, and a small number of account-lifecycle records are retained indefinitely."}
          </Translate>,
          <Translate key="p2" id="privacy.sections.retention.p2">
            {"Deletion is immediate and irreversible. There is no \u201cpending deletion\u201d state, no grace period and no undo, and you are asked to re-enter your password first. Everything the account owns goes at once, including uploaded files in object storage, and including things you had shared with other people \u2014 shared items are deleted, not handed over."}
          </Translate>,
          <Translate key="p3" id="privacy.sections.retention.p3">
            {"Three things are kept on purpose, and it would be a lie to claim otherwise. First, audit logs are not erased by account deletion \u2014 an audit trail the subject can erase is not an audit trail. They expire on their own schedule instead: 7 days by default, 30 days for security-relevant events (sign-in attempts, group and membership changes), and a small number of account-lifecycle and system-configuration records (such as \u201cthis account was created\u201d) indefinitely. The cleanup job runs once a day at 03:00, so the real maximum is less than a day longer than the period stated. Second, if your account owns an AI agent, that agent\u2019s configuration row is emptied and retired rather than deleted \u2014 it is the only source of the author name on every comment that agent left on other people\u2019s cards, and deleting it would damage their data, not yours. Third, a group your account owns is soft-deleted, so that membership and credential revocation can be handled."}
          </Translate>,
          <Translate key="p4" id="privacy.sections.retention.p4">
            {"To delete your account today, email lintao.amons@gmail.com from the address you signed up with and say you want it deleted. In-app account deletion went live on 21 August 2026 and is available in the mobile app. The web app has no self-service deletion \u2014 if you use udctl only in the browser, email is the route that works for you."}
          </Translate>,
          <Translate key="p5" id="privacy.sections.retention.p5">
            {"On the desktop app with local storage, or on an instance you host yourself, none of this involves us: deleting the data \u2014 or the whole database file \u2014 is entirely in your hands."}
          </Translate>,
        ]}
      />

      <PolicySection
        icon={<Shield size={20} strokeWidth={2} />}
        titleId="privacy.sections.security.title"
        titleDefault="Security"
        paragraphs={[
          <Translate key="p1" id="privacy.sections.security.p1">
            {"I do my best: HTTPS everywhere, passwords are hashed, database is secured. But I'm not a security expert. If you're handling sensitive data, self-host or use the desktop app."}
          </Translate>,
          <Translate key="p2" id="privacy.sections.security.p2">
            For self-hosted users, security is in your hands. Keep your server updated and follow basic security practices.
          </Translate>,
        ]}
      />

      <PolicySection
        icon={<Monitor size={20} strokeWidth={2} />}
        titleId="privacy.sections.webClipper.title"
        titleDefault="Web Clipper Chrome Extension"
        paragraphs={[
          <Translate key="p1" id="privacy.sections.webClipper.p1">
            {"The Web Clipper extension captures page content only when you click \u201cSave\u201d, and sends it to your local disk or to the udctl server you configured \u2014 never to a third party. Your credentials are stored on your device and are only ever sent to that same server URL. The extension bundles all of its scripts locally, loads no remote code, and does not track your browsing history or activity."}
          </Translate>,
        ]}
      />

      {/* Options */}
      <div className={styles.optionsGrid}>
        <Link to="/download#desktop" className={styles.optionCard}>
          <Monitor size={20} strokeWidth={2} className={styles.optionCardIcon} />
          <div>
            <div className={styles.optionCardTitle}>
              <Translate id="privacy.options.desktop.title">Desktop App</Translate>
            </div>
            <div className={styles.optionCardDescription}>
              <Translate id="privacy.options.desktop.description">
                100% local, your device only
              </Translate>
            </div>
          </div>
        </Link>
        <Link to="/self-hosting" className={styles.optionCard}>
          <Server size={20} strokeWidth={2} className={styles.optionCardIcon} />
          <div>
            <div className={styles.optionCardTitle}>
              <Translate id="privacy.options.selfhost.title">Self-Host</Translate>
            </div>
            <div className={styles.optionCardDescription}>
              <Translate id="privacy.options.selfhost.description">
                Your server, full control
              </Translate>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className={styles.contactSection}>
      <div className={styles.contactHeader}>
        <Mail size={20} strokeWidth={2} />
        <h2 className={styles.contactTitle}>
          <Translate id="privacy.contact.title">Questions?</Translate>
        </h2>
      </div>
      <p className={styles.contactDescription}>
        <Translate id="privacy.contact.description">
          {"If you have questions or concerns, just reach out. I'm a real person, not a support ticket system."}
        </Translate>
      </p>
      <Link to="/contact" className={styles.contactButton}>
        <Translate id="privacy.contact.button">Contact Me</Translate>
      </Link>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className={styles.footerSection}>
      <div className={styles.footerBrand}>
        <span className={styles.footerLogo}>udctl</span>
        <span className={styles.footerCopyright}>© {new Date().getFullYear()}</span>
      </div>
      <div className={styles.footerLinks}>
        <Link to="/download" className={styles.footerLink}>
          <Translate id="homepage.footer.download">Download</Translate>
        </Link>
        <Link to="/docs/intro" className={styles.footerLink}>
          <Translate id="homepage.footer.documentation">Documentation</Translate>
        </Link>
        <Link to="/docs/pricing" className={styles.footerLink}>
          <Translate id="homepage.footer.pricing">Pricing</Translate>
        </Link>
      </div>
    </footer>
  );
}

export default function PrivacyPage(): ReactNode {
  return (
    <Layout
      title={translate({
        id: 'privacy.meta.title',
        message: 'Privacy Policy',
        description: 'The privacy page meta title',
      })}
      description={translate({
        id: 'privacy.meta.description',
        message: 'An honest take on data privacy from an indie developer. Your data, your choice.',
        description: 'The privacy page meta description',
      })}>
      <main className={styles.mainContainer}>
        <HeroSection />
        <PolicyContent />
        <ContactSection />
        <FooterSection />
      </main>
    </Layout>
  );
}
