import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// Centralized version - update version.json when releasing
const versionConfig = require('./version.json');
const VERSION = versionConfig.version;

const config: Config = {
  // Search-facing brand token. 'udctl' is the suffix every page's <title> and
  // og:title carry (theme formats `${page} | ${title}`). Chosen 2026-09-12 (ud task
  // f02f82bb): 'ud' and 'undercontrol' cannot be ranked for (two letters / the
  // phrase "under control"), 'udctl' has no competing owner anywhere we checked.
  // Since the rename (same day, same task) the navbar, h1 and body copy say udctl
  // too; UnDercontrol is the full name, written once as "udctl (UnDercontrol)" (ud card 38c286b2).
  title: 'udctl',
  tagline: 'Explore. Capture. Distill. A private workspace for people and AI agents.',
  favicon: 'img/favicon.svg',

  future: {
    v4: true,
  },

  // Canonical host since 2026-09-12 (epic f02f82bb): the owner bought udctl.com for the
  // rename. Everything derived from this — canonical, hreflang, og:url, sitemap, RSS
  // links — flips together. oatnil.com stays registered and 301s here (Cloudflare rule).
  url: 'https://udctl.com',
  baseUrl: '/',

  // Canonicalize on the trailing-slash form: Google had accumulated impressions
  // against both /docs/x and /docs/x/ for the same page, splitting the signal.
  trailingSlash: true,

  organizationName: 'oatnil-top',
  projectName: 'udctl', // GitHub repo renamed from ud-docs on 2026-09-12 (epic f02f82bb); old URLs redirect

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hans'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
      'zh-Hans': {
        label: '简体中文',
        direction: 'ltr',
        htmlLang: 'zh-Hans',
      },
    },
  },

  // Cloudflare Web Analytics (privacy-first RUM). The udctl.com site in the Cloudflare
  // account is set to "Enable with JS Snippet installation" because automatic
  // injection never appeared on this Workers static-assets site (checked 2026-09-12,
  // 10+ min, curl saw no beacon). The token is public by design: it is the same value
  // Cloudflare would have injected into every page. ud task f02f82bb.
  // Google Fonts are pulled by @import in src/css/custom.css; preconnecting to both hosts
  // removes a DNS+TLS round trip from the critical path (audit efb0ebf3 #7, step 1;
  // self-hosting the woff2 files is the follow-up).
  headTags: [
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'}},
    {tagName: 'link', attributes: {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous'}},
  ],

  scripts: [
    {
      src: 'https://static.cloudflareinsights.com/beacon.min.js',
      defer: true,
      'data-cf-beacon': '{"token": "a806539ae03c4726a749ef2e59f227de"}',
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/oatnil-top/udctl/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/oatnil-top/udctl/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        // lastmod from git history lets Google spend its crawl on pages that changed
        // (audit #11); changefreq/priority are ignored by Google and only add bytes.
        sitemap: {lastmod: 'date', changefreq: null, priority: null},
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-B3E5P48S9Y',
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Site-wide social card (audit efb0ebf3 #4): every docs/blog page shares it when a
    // link is pasted into Telegram / X / Discord. The homepage swaps in the zh card by
    // locale (src/pages/index.tsx). 1200×630, text-only, generated with PIL from system
    // fonts; replace the PNGs when design delivers a real card, keep the paths.
    image: 'img/social-card.png',
    /*
     * Dark mode was never something this site opted into — with no colorMode
     * block at all it ran on Docusaurus' defaults, which means the toggle has
     * been in the navbar and a dark palette has been shipping all along, only
     * half-styled. So we ADD to that machinery rather than take it over: the
     * switch stays `[data-theme='dark']`, our colours are Infima variables,
     * and nothing here swizzles ColorModeProvider (whose SSR anti-flash
     * script is exactly the part you do not want to re-implement).
     *
     * respectPrefersColorScheme was false, so a visitor whose OS is in dark
     * mode still landed on the light site. Turning it true is deliberately
     * the LAST change of this batch (ud task 8496fc04): from this line
     * onwards the dark palette is what those visitors see first, so it had to
     * be finished before the switch was thrown, not after.
     */
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'udctl',
      logo: {
        alt: 'udctl Logo',
        src: 'img/favicon.svg',
      },
      // Four destinations on the left, three controls on the right — the
      // header's shape copied from the reference page (ud task d9f0567c):
      // plain text (there, a login; here, the locale switch) → outlined button
      // → filled button. Self-Host moved from the left group into the outlined
      // slot; it was not invented for the slot, it is our own main path.
      // Pricing joined the left group 2026-09-14 (ud task 9b50033d); since 2026-09-19
      // it points at /docs/pricing, the one pricing page (the /subscribe TSX page was
      // retired and 301s there).
      // No dropdown chevrons on the left four: none of them has a submenu,
      // and a chevron would draw a feature that does not exist.
      // Cookbook lives in the Docs sidebar (autogenerated); version, Privacy,
      // Contact and GitHub live in the footer, the only other site-wide surface.
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/alfred', label: 'Alfred', position: 'left'},
        {to: '/docs/pricing', label: 'Pricing', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          to: '/self-hosting',
          label: 'Self-Host',
          position: 'right',
          className: 'navbar__outline',
        },
        {
          to: '/download',
          label: 'Download',
          position: 'right',
          className: 'navbar__cta',
        },
      ],
    },
    // The footer is the landing surface for everything the navbar sheds, so it
    // must stay visible — see the .footer rules in src/css/custom.css.
    footer: {
      style: 'light',
      links: [
        {
          title: 'Product',
          items: [
            {
              label: 'Download',
              to: '/download',
            },
            {
              label: 'Pricing',
              to: '/docs/pricing',
            },
            {
              label: 'Self-Host',
              to: '/self-hosting',
            },
            {
              label: 'Cookbook',
              to: '/docs/cookbook',
            },
          ],
        },
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'Chrome Extension',
              href: 'https://github.com/oatnil-top/ud-chrome-extension',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            // The components page, not a repo link: it is the surface that
            // says which repositories are published and under what license.
            // The "Chrome Extension" entry above points at the same repo URL
            // the page's card does, so the two never send a reader elsewhere.
            {
              label: 'Open Source Components',
              to: '/open-source',
            },
            {
              label: 'Telegram',
              href: 'https://t.me/+4hZC0GtTe1syYzhl',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/oatnil-top/udctl',
            },
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/oatnil-top/udctl/discussions',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Contact',
              to: '/contact',
            },
            {
              label: 'Privacy Policy',
              to: '/privacy',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} UnDercontrol Project · v${VERSION}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
