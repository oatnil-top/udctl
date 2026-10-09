/**
 * "Open With" feature landing page — standalone marketing page at /open-with.
 *
 * Sibling of /self-hosting: a human-facing product page (src/pages/ is for
 * humans, docs/ is for agents — see site CLAUDE.md), styled to match
 * self-hosting exactly. The authoritative, machine-readable write-up lives at
 * docs/features/open-with.md; every section here links to its matching heading,
 * and the copy must stay on the same footing as that doc — in particular the
 * availability line (web live now, desktop next release). Do NOT add not-yet-
 * shipped improvements here.
 *
 * i18n: pure TSX, both locales as {en, zh} picked by the current docusaurus
 * locale (same pattern as configuration.tsx) — there is NO i18n mirror file.
 * Screenshots are real captures of the live web app, reused across locales.
 */
import {useState, type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  Files,
  PlugZap,
  ShieldCheck,
  Copy,
  Check,
  Diamond,
  Image as ImageIcon,
  FileText,
  Table,
  Presentation,
  PenLine,
  Code2,
} from 'lucide-react';

import styles from './open-with.module.css';

type L = {en: string; zh: string};

const DOCS = '/docs/features/open-with';
const WEB_APP = 'https://app.udctl.com';
const REGISTRY = 'https://github.com/oatnil-top/ud-registry';

// The complete, working plugin from the docs — real and copy-pasteable, the
// same way /self-hosting ships real compose files. Not translated (it is code).
const PLUGIN_CODE = `<!doctype html>
<html>
  <body>
    <pre id="out">Waiting for a file…</pre>
    <script>
      // 1. Listen for the file udctl will send.
      window.addEventListener('message', function (event) {
        var msg = event.data;
        if (!msg || msg.udPlugin !== 1 || msg.type !== 'file') return;
        var text = new TextDecoder().decode(msg.bytes);
        document.getElementById('out').textContent =
          msg.fileName + '\\n\\n' + text;
      });
      // 2. Tell udctl we are ready to receive it.
      parent.postMessage({ udPlugin: 1, type: 'ready' }, '*');
    </script>
  </body>
</html>`;

function renderCode(code: string): ReactNode {
  return code.split('\n').map((line, i) => {
    const cls = line.trimStart().startsWith('//') ? styles.cmt : undefined;
    return (
      <span key={i} className={cls}>
        {line + '\n'}
      </span>
    );
  });
}

function CodeCard({name, code, zh}: {name: string; code: string; zh: boolean}) {
  const [copied, setCopied] = useState(false);
  const onCopy = () => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        },
        () => undefined,
      );
    }
  };
  return (
    <div className={styles.term}>
      <div className={styles.termBar}>
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.termName}>{name}</span>
        <button type="button" className={`${styles.copybtn} ${copied ? styles.ok : ''}`} onClick={onCopy}>
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? (zh ? '已复制' : 'Copied') : zh ? '复制' : 'Copy'}
        </button>
      </div>
      <div className={`${styles.termBody} ${styles.wrap}`}>
        <pre>{renderCode(code)}</pre>
      </div>
    </div>
  );
}

function Shot({src, alt, caption}: {src: string; alt: string; caption?: string}) {
  return (
    <figure className={styles.featureShot}>
      <div className={styles.shot}>
        <img src={src} alt={alt} loading="lazy" />
      </div>
      {caption ? <figcaption className={styles.shotCap}>{caption}</figcaption> : null}
    </figure>
  );
}

const VIEWERS: {Icon: typeof Files; title: L; desc: L}[] = [
  {
    Icon: Diamond,
    title: {en: 'Diagrams', zh: '图表'},
    desc: {en: '.drawio general diagrams and udctl dataflow diagrams', zh: '.drawio 通用图表与 udctl 数据流图'},
  },
  {
    Icon: PenLine,
    title: {en: 'Excalidraw', zh: 'Excalidraw'},
    desc: {en: 'Hand-drawn style sketches', zh: '手绘风格草图'},
  },
  {
    Icon: ImageIcon,
    title: {en: 'Images, video & audio', zh: '图片、视频与音频'},
    desc: {en: 'Preview media inline', zh: '内嵌预览媒体文件'},
  },
  {
    Icon: FileText,
    title: {en: 'PDF & Word', zh: 'PDF 与 Word'},
    desc: {en: 'Documents open in place', zh: '文档就地打开'},
  },
  {
    Icon: Table,
    title: {en: 'Spreadsheets & tables', zh: '电子表格与表格'},
    desc: {en: 'Rows and columns, rendered', zh: '行列直接渲染'},
  },
  {
    Icon: Code2,
    title: {en: 'Markdown, code & text', zh: 'Markdown、代码与文本'},
    desc: {en: 'Syntax highlighting built in', zh: '内置语法高亮'},
  },
  {
    Icon: Presentation,
    title: {en: 'Presentations & HTML', zh: '演示文稿与 HTML'},
    desc: {en: 'Slides and web pages', zh: '幻灯片与网页'},
  },
];

export default function OpenWith(): ReactNode {
  const {i18n} = useDocusaurusContext();
  const zh = i18n.currentLocale === 'zh-Hans';
  const t = (l: L) => (zh ? l.zh : l.en);

  return (
    <Layout
      title={t({
        en: 'Open With — every file opened the right way | udctl',
        zh: '打开方式 — 每个文件都用最合适的方式打开 | udctl',
      })}
      description={t({
        en: 'udctl shows each file in a viewer that fits it, lets you switch viewers and set your own defaults, and lets you add brand-new viewers with sandboxed plugins — installed one click from the plugin library.',
        zh: 'udctl 用最合适的查看器显示每个文件，让你切换查看器、设置自己的默认项，还能用沙箱隔离的插件添加全新的查看器——从插件库一键安装。',
      })}>
      <main className={styles.page}>
        {/* Hero */}
        <header className={styles.hero}>
          <p className={styles.eyebrow}>{t({en: 'Open With', zh: '打开方式'})}</p>
          <h1 className={styles.heroTitle}>
            {t({en: 'Every file, ', zh: '每个文件，'})}
            <em>{t({en: 'opened the right way.', zh: '用最合适的方式打开。'})}</em>
          </h1>
          <p className={`${styles.lede} ${styles.heroLede}`}>
            {t({
              en: 'udctl shows each file in a viewer that fits it — a picture in the image viewer, a diagram in the diagram editor. Switch viewers whenever you like, set your own default, or teach udctl a brand-new file type with a plugin.',
              zh: 'udctl 用最合适的查看器显示每个文件——图片用图片查看器，图表用图表编辑器。你可以随时切换查看器、设置自己的默认项，或用插件教会 udctl 一种全新的文件类型。',
            })}
          </p>
          <div className={styles.pillrow}>
            <span className={styles.pill}>
              <b>7+</b> {t({en: 'built-in viewers', zh: '内置查看器'})}
            </span>
            <span className={styles.pill}>
              <b>1-click</b> {t({en: 'plugin install', zh: '插件安装'})}
            </span>
            <span className={styles.pill}>
              <b>{t({en: 'Live', zh: '已上线'})}</b> {t({en: 'in the web app', zh: '网页版'})}
            </span>
          </div>
          <Shot
            src="/features/open-with/open-with-menu.png"
            alt={t({en: 'The Open with menu showing available viewers', zh: '“打开方式”菜单，列出可用的查看器'})}
          />
          <div className={styles.btnrow}>
            <Link className={styles.btnPrimary} to="#viewers">
              {t({en: 'See how it works →', zh: '看看它怎么用 →'})}
            </Link>
            <Link className={styles.btnGhost} to={WEB_APP}>
              {t({en: 'Try it in the web app', zh: '在网页版试用'})}
            </Link>
            <Link className={styles.btnGhost} to={DOCS}>
              {t({en: 'Read the docs', zh: '阅读文档'})}
            </Link>
          </div>
        </header>

        {/* Feature 1: the right viewer, switchable, with your own default */}
        <section className={styles.section} id="viewers">
          <p className={styles.eyebrow}>{t({en: 'The right viewer', zh: '合适的查看器'})}</p>
          <h2 className={styles.h2}>{t({en: 'The right view, and yours to change.', zh: '合适的视图，随你更改。'})}</h2>
          <div className={styles.feature} style={{marginTop: 28}}>
            <div className={styles.featureText}>
              <h3>{t({en: 'Switch the viewer in a click', zh: '一键切换查看器'})}</h3>
              <p>
                {t({
                  en: 'Most of the time udctl picks the right viewer automatically from the file name. When a file can be shown more than one way, the',
                  zh: '大多数时候 udctl 会根据文件名自动选好查看器。当一个文件可以用多种方式显示时，文件上方的',
                })}{' '}
                <code>{t({en: 'Open with', zh: '打开方式'})}</code>{' '}
                {t({
                  en: 'button above it shows which viewer is in use and lets you switch to another — plus View as Text and Download, always available.',
                  zh: '按钮会显示当前使用的查看器，并让你切换到另一个——此外还随时提供“以文本查看”和“下载”。',
                })}
              </p>
              <h3>{t({en: 'Set a default that follows you', zh: '设置跟随你的默认项'})}</h3>
              <p>
                {t({
                  en: 'Always want a certain file type to open the same way? Choose "Always open .xyz files this way". The default is tied to your account, so it follows you across devices and changes nothing for anyone else.',
                  zh: '想让某种文件总是用同样方式打开？选择“始终以此方式打开 .xyz 文件”。默认项绑定到你的账号，会跨设备跟随你，也不会影响任何其他人。',
                })}
              </p>
              <Link className={styles.docLink} to={`${DOCS}#switching-the-viewer`}>
                {t({en: 'Switching & defaults, in the docs →', zh: '文档：切换与默认项 →'})}
              </Link>
            </div>
            <Shot
              src="/features/open-with/open-with-menu.png"
              alt={t({en: 'The Open with menu with a viewer checked and a "set default" option', zh: '“打开方式”菜单，选中的查看器带勾、并有“设为默认”选项'})}
            />
          </div>

          <div style={{marginTop: 56}}>
            <p className={styles.eyebrow}>{t({en: 'Built in', zh: '内置'})}</p>
            <h3 className={styles.h2} style={{fontSize: 22}}>
              {t({en: 'Viewers for the file types you use most.', zh: '覆盖你最常用的文件类型。'})}
            </h3>
            <div className={styles.viewers}>
              {VIEWERS.map(({Icon, title, desc}) => (
                <div key={title.en} className={styles.viewerItem}>
                  <Icon size={20} strokeWidth={1.7} />
                  <h4>{t(title)}</h4>
                  <p>{t(desc)}</p>
                </div>
              ))}
            </div>
            <p className={styles.viewersNote}>
              <b>{t({en: 'Anything else?', zh: '其他类型？'})}</b>{' '}
              {t({
                en: 'Any file type without a built-in viewer shows a download link — until you add a viewer for it with a plugin.',
                zh: '任何没有内置查看器的文件类型都会显示下载链接——直到你用插件为它添加一个查看器。',
              })}
            </p>
          </div>
        </section>

        {/* Feature 2: write your own viewer */}
        <section className={styles.section}>
          <p className={styles.eyebrow}>{t({en: 'Your own viewer', zh: '你自己的查看器'})}</p>
          <h2 className={styles.h2}>{t({en: 'Teach udctl a new file type.', zh: '教会 udctl 一种新文件类型。'})}</h2>
          <p className={`${styles.lede} ${styles.sub}`}>
            {t({
              en: 'A plugin is one self-contained .html file — much like installing an app so your OS can open a new kind of file. udctl hands the plugin the file to show, and the plugin draws it. A complete, working plugin is just this:',
              zh: '一个插件就是一个自包含的 .html 文件——就像安装一个 app 让操作系统能打开一种新文件。udctl 把要显示的文件交给插件，插件负责绘制。一个完整可用的插件就这么简单：',
            })}
          </p>
          <div style={{marginTop: 22}}>
            <CodeCard name="viewer.html" code={PLUGIN_CODE} zh={zh} />
          </div>
          <div className={styles.safety}>
            <ShieldCheck size={22} strokeWidth={1.7} />
            <div>
              <h3>{t({en: 'Sandboxed, and only yours', zh: '沙箱隔离，且只属于你'})}</h3>
              <p>
                {t({
                  en: 'udctl runs each plugin in a locked-down sandbox: it can read and display the one file you opened, but it cannot reach the network, see your other files, or touch your account. You see what a plugin can do and confirm before it installs — so the rule is simple: install only plugins you trust. Plugins you install are yours alone.',
                  zh: 'udctl 在一个封闭沙箱里运行每个插件：它只能读取并显示你打开的那一个文件，无法访问网络、看不到你的其他文件、也碰不到你的账号。安装前你会看到插件能做什么并需要确认——所以规则很简单：只装你信任的插件。你安装的插件只属于你自己。',
                })}
              </p>
            </div>
          </div>
          <Shot
            src="/features/open-with/plugin-render.png"
            alt={t({
              en: 'The Jupyter Notebook Viewer plugin rendering a notebook with code cells and a chart',
              zh: 'Jupyter Notebook Viewer 插件渲染一个带代码单元和图表的笔记本',
            })}
            caption={t({
              en: 'The Jupyter Notebook Viewer plugin rendering spend-analysis.ipynb',
              zh: 'Jupyter Notebook Viewer 插件渲染 spend-analysis.ipynb',
            })}
          />
          <Link className={styles.docLink} to={`${DOCS}#writing-your-own-plugin`}>
            {t({en: 'The plugin protocol, in the docs →', zh: '文档：插件协议 →'})}
          </Link>
        </section>

        {/* Feature 3: plugin library / registry */}
        <section className={styles.section}>
          <p className={styles.eyebrow}>{t({en: 'Plugin library', zh: '插件库'})}</p>
          <h2 className={styles.h2}>{t({en: 'Browse, install in one click, share your own.', zh: '浏览、一键安装、分享你自己的。'})}</h2>
          <div className={styles.feature} style={{marginTop: 28}}>
            <Shot
              src="/features/open-with/plugin-library.png"
              alt={t({en: 'Settings → Resource plugins → Plugin library, listing installable plugins', zh: '设置 → 资源插件 → 插件库，列出可安装的插件'})}
            />
            <div className={`${styles.featureText}`}>
              <h3>{t({en: 'One click from the library', zh: '从插件库一键安装'})}</h3>
              <p>
                {t({
                  en: 'Open Settings → Resource plugins → Plugin library to browse plugins published to the official registry and install one with a single click. udctl verifies each plugin against a fingerprint in the registry, so what you install is exactly what was published.',
                  zh: '打开 设置 → 资源插件 → 插件库，浏览发布到官方 registry 的插件，一键安装。udctl 会用 registry 中的指纹校验每个插件，确保你装到的就是发布的那一份。',
                })}
              </p>
              <h3>{t({en: 'A ready-made example', zh: '一个现成的例子'})}</h3>
              <p>
                {t({
                  en: 'The official Jupyter Notebook Viewer renders .ipynb notebooks — markdown and code cells, highlighting, tables and images. Install it from the library to try plugins in seconds.',
                  zh: '官方的 Jupyter Notebook Viewer 可以渲染 .ipynb 笔记本——markdown 与代码单元、语法高亮、表格和图片。从插件库安装它，几秒钟就能试用插件。',
                })}
              </p>
              <Link className={styles.docLink} to={`${DOCS}#the-plugin-registry`}>
                {t({en: 'How the registry works, in the docs →', zh: '文档：registry 如何运作 →'})}
              </Link>
            </div>
          </div>

          <div style={{marginTop: 56}}>
            <p className={styles.eyebrow}>{t({en: 'Submit your own', zh: '提交你自己的'})}</p>
            <h3 className={styles.h2} style={{fontSize: 22}}>
              {t({en: 'Publish a plugin for everyone.', zh: '发布一个插件给所有人。'})}
            </h3>
            <div className={styles.steps}>
              <div className={styles.step}>
                <span className={styles.stepNum}>1</span>
                <div>
                  <h4>{t({en: 'Fork the registry', zh: 'Fork registry 仓库'})}</h4>
                  <p>
                    {t({en: 'Fork the public repository', zh: 'Fork 公开仓库'})}{' '}
                    <a href={REGISTRY} target="_blank" rel="noreferrer">
                      oatnil-top/ud-registry
                    </a>
                    .
                  </p>
                </div>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNum}>2</span>
                <div>
                  <h4>{t({en: 'Add your file and entry', zh: '加入你的文件和条目'})}</h4>
                  <p>
                    {t({en: 'Drop your built', zh: '把你构建好的'})} <code>.html</code>{' '}
                    {t({en: 'under', zh: '放到'})} <code>plugins/&lt;id&gt;/&lt;id&gt;.html</code>{' '}
                    {t({en: 'and add a matching entry in', zh: '并在'})} <code>plugins.json</code>{' '}
                    {t({en: '.', zh: '中加入对应条目。'})}
                  </p>
                </div>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNum}>3</span>
                <div>
                  <h4>{t({en: 'Open a pull request', zh: '提交 pull request'})}</h4>
                  <p>
                    {t({
                      en: 'An automated check verifies the fingerprint, a reviewer reads the source, and merging publishes it to the library.',
                      zh: '自动检查会校验指纹，审阅者会阅读源码，合并后即发布到插件库。',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Availability — same footing as the docs page */}
        <section className={styles.section}>
          <div className={styles.avail}>
            <PlugZap size={22} strokeWidth={1.7} />
            <div>
              <h3>{t({en: 'Where it works today', zh: '目前在哪里可用'})}</h3>
              <p>
                {t({
                  en: 'Open with, and everything on this page, is live now in the web app at ',
                  zh: '“打开方式”以及本页的全部内容，现已在网页版上线：',
                })}
                <a href={WEB_APP} target="_blank" rel="noreferrer">
                  app.udctl.com
                </a>
                {t({
                  en: '. It is coming to the desktop app in an upcoming release — until then, use the web app for these features.',
                  zh: '。桌面端将在下个版本加入——在那之前，请在网页版使用这些功能。',
                })}
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={`${styles.section} ${styles.cta}`}>
          <h2 className={styles.ctaTitle}>{t({en: 'Open anything. Your way.', zh: '打开一切，按你的方式。'})}</h2>
          <p>
            {t({
              en: 'Try the viewers in the web app, read the full guide, or browse the plugin registry.',
              zh: '在网页版试用各种查看器，阅读完整指南，或浏览插件 registry。',
            })}
          </p>
          <div className={styles.btnrow}>
            <Link className={styles.btnPrimary} to={WEB_APP}>
              {t({en: 'Open the web app', zh: '打开网页版'})}
            </Link>
            <Link className={styles.btnGhost} to={DOCS}>
              {t({en: 'Read the full guide', zh: '阅读完整指南'})}
            </Link>
            <Link className={styles.btnGhost} to={REGISTRY}>
              {t({en: 'Browse the registry', zh: '浏览 registry'})}
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
