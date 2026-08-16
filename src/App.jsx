import { useState, useRef, useEffect } from 'react';
import { Howl } from 'howler';
import WaveBackground from './components/WaveBackground.jsx';
import Controls from './components/Controls.jsx';
import Window from './components/Window.jsx';
import { MailIcon, ChainIcon } from './components/Icons.jsx';
import HorseSprite from './components/HorseSprite.jsx';
import { playPianoNote } from './utils/piano.js';

const NAV_ITEMS = [
  { id: 'about', img: '/icons/about.png', label: 'about' },
  { id: 'links', img: '/icons/links.png', label: 'links' },
  { id: 'work', img: '/icons/work.png', label: 'work' },
  { id: 'contact', img: '/icons/contact.png', label: 'socials' },
];

const PROJECTS = [
  {
    title: 'CPD Query Console',
    tagline: "A natural-language interface for Chicago's public crime data.",
    description: "Type a question in plain English and it's parsed into a structured query, validated, and run live against Chicago's crime feed — rendered as an interactive heatmap with a vacant-lots layer and time/type/area aggregations.",
    link: 'https://cpd-query-console.vercel.app',
    icon: '🗺️',
  },
  {
    title: 'Federated Diabetes Prediction',
    tagline: 'Privacy-preserving learning across heterogeneous, multi-site healthcare data.',
    description: 'Local, federated, and centralized models are trained and benchmarked live in the browser on the Pima Indians Diabetes dataset, split across three simulated hospitals by BMI to create realistic non-IID heterogeneity.',
    link: 'https://federated-diabetes-demo.vercel.app',
    icon: '🧬',
  },
  {
    title: 'NDA Review Engine',
    tagline: 'A customizable, clause-level NDA redlining engine — with a real backend API.',
    description: 'Upload a non-disclosure agreement, define the rules your firm reviews against, and get back a genuine Word tracked-changes redline plus a signed execution copy. Runs fully client-side, or call the same engine as a real serverless API with client SDKs for Node.js and Python.',
    link: 'https://nda-review-engine.vercel.app',
    icon: '⚖️',
  },
  {
  title: 'Money Mastermind',
  tagline: 'A financial literacy card game reaching 150,000+ students.',
  description: 'A physical card game teaching kids financial decision-making, then built through multiple prototypes and tested across Chicago Public Schools. Now integrated into Junior Achievement\'s Middle School "Economics for Success" program and evolving into a blended physical-plus-digital curriculum for grades 4–6.',
  link: 'https://money-mastermind.vercel.app',
  icon: '💰',
},
{
    title: 'FinYay',
    tagline: 'Interactive, teacher-led financial literacy platform for grades 4–6 — "Khan Academy for financial literacy."',
    description: 'The digital evolution of Money Mastermind: a teacher-led classroom experience projected on one shared screen, where students join with a daily code and tap pre-assigned icon tiles to make decisions across six units — Earning, Spending, Saving, Investing, Managing Credit, and Managing Risk. AI batch-generates each class\'s sessions ahead of time, including branching content that adapts to how the class actually voted, so no AI ever talks to kids live. Curriculum is standards-mapped to national Jump$tart/CEE and Illinois ISBE frameworks.',
    link: null,
    icon: '🎓',
  },
];

const TOOLS_AND_DEV = ['Cursor', 'GitHub Copilot', 'Claude Code', 'Python', 'C++', 'JavaScript', 'HTML/CSS', 'React', 'SQL', 'Databricks', 'Salesforce', 'Figma', 'Adobe Illustrator', 'Adobe Photoshop'];
const PRODUCT_AND_ANALYSIS = ['Product Management', 'Product Strategy', 'User Research', 'Competitive Analysis', 'Data-Driven Decision Making', 'Data Visualization', 'Data Pipelines', 'Machine Learning', 'Data Science', 'Stakeholder Presentations', 'Qualtrics'];

function TypedHeading() {
  const prefix = "hi! i'm ";
  const name = 'Vivian';
  const suffix = '';
  const full = prefix + name + suffix;
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count >= full.length) return;
    const timeout = setTimeout(() => setCount((c) => c + 1), 110);
    return () => clearTimeout(timeout);
  }, [count, full.length]);

  const shown = full.slice(0, count);
  const prefixShown = shown.slice(0, prefix.length);
  const nameShown = shown.slice(prefix.length, prefix.length + name.length);
  const suffixShown = shown.slice(prefix.length + name.length);
  const done = count >= full.length;

  return (
    <h1>
      {prefixShown}
      <span className="accent">{nameShown}</span>
      {suffixShown}
      <span className={`typing-cursor ${done ? 'typing-cursor-blink' : ''}`}>|</span>
    </h1>
  );
}

// starting cascade offsets for each window, relative to viewport center
const OFFSETS = {
  about: { dx: -380, dy: -260 },
  links: { dx: -350, dy: -200 },
  work: { dx: -410, dy: -320 },
  contact: { dx: -350, dy: -150 },
};

function getInitialPositions() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  return Object.fromEntries(
    Object.entries(OFFSETS).map(([id, { dx, dy }]) => [id, { left: cx + dx, top: cy + dy }])
  );
}

export default function App() {
  const [theme, setTheme] = useState('light');
  const [sfxOn, setSfxOn] = useState(true);
  const [openWindows, setOpenWindows] = useState({});
  const [positions, setPositions] = useState(getInitialPositions);
  const [zIndexes, setZIndexes] = useState({});
  const [topZ, setTopZ] = useState(40);
  const [runHorse, setRunHorse] = useState(false);

  const triggerHorse = () => {
  setRunHorse(true);
  if (sfxOn) gallopSound.current.play();
  setTimeout(() => {
    setRunHorse(false);
    gallopSound.current.stop();
  }, 2200);
};

  // Howler sounds — open and close each get their own file in public/sounds/
  const clickSound = useRef(
    new Howl({ src: ['/sounds/click.mp3'], volume: 0.4, onloaderror: () => {} })
  );
  const closeSound = useRef(
    new Howl({ src: ['/sounds/close.mp3'], volume: 0.4, onloaderror: () => {} })
  );

  const gallopSound = useRef(
  new Howl({ src: ['/sounds/gallop.mp3'], volume: 0.5, onloaderror: () => {} })
);

  const playClick = () => {
    if (sfxOn) clickSound.current.play();
  };

  const playCloseSound = () => {
    if (sfxOn) closeSound.current.play();
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const bringToFront = (id) => {
    const nextZ = topZ + 1;
    setTopZ(nextZ);
    setZIndexes((prev) => ({ ...prev, [id]: nextZ }));
  };

  const openWindow = (id) => {
    setOpenWindows((prev) => ({ ...prev, [id]: true }));
    bringToFront(id);
    playClick();
  };

  const closeWindow = (id) => {
    setOpenWindows((prev) => ({ ...prev, [id]: false }));
    playCloseSound();
  };

  const handleDrag = (id, newPos) => {
    setPositions((prev) => ({ ...prev, [id]: newPos }));
  };

  return (
    <>
      <WaveBackground />
<img src="/images/boat.png" alt="" className="boat-float" />
      {runHorse && <div className="horse-runner"><HorseSprite /></div>}
      <Controls
        theme={theme}
        onToggleTheme={toggleTheme}
        sfxOn={sfxOn}
        onToggleSfx={() => setSfxOn((v) => !v)}
      />

      <main className="desktop">
        <div className="home-window">
          <div className="home-titlebar">home</div>
          <div className="home-body">
            <div className="avatar-wrap">
  <TypedHeading />
  <p className="tagline">I like to develop and launch tools!</p>
  <p className="tagline" style={{ marginTop: 8 }}>Feel free to email me at <span style={{ color: 'var(--accent-strong)' }}>vivian.kaleta &lt;at&gt; yale.edu</span></p>
</div>

            <nav className="icon-nav">
              {NAV_ITEMS.map(({ id, img, label }) => (
                <button key={id} className="nav-icon" onClick={() => openWindow(id)}>
                  <span className="nav-icon-glyph"><img src={img} alt={label} className="nav-icon-img" /></span>
                  <span className="nav-icon-label">{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <footer className="footer">
          <span>© 2026 Vivian Kaleta</span>
          <span className="attribution">
          </span>
        </footer>
      </main>

      <Window
  id="about"
  title="about"
  className="window-about"
  isOpen={!!openWindows.about}
  zIndex={zIndexes.about || 40}
  position={positions.about}
  onClose={closeWindow}
  onFocus={bringToFront}
  onDrag={handleDrag}
>
        <div className="about-header">
        <img className="about-photo" src="/images/about-photo.jpg" alt="Vivian Kaleta" />
          <div>
            <h2 className="about-name">Vivian Kaleta</h2>
            <p className="about-subtitle">Yale University '28</p>
            <p className="about-subtitle">Computer Science + Economics with a Certificate in Data Science</p>
          </div>
        </div>

        <p className="about-section-title">ON CAMPUS...</p>

<ul className="about-list">
  <li><span className="horse-trigger" onClick={triggerHorse}>Horse</span> Polo Intercollegiate Team</li>
  <li>Computer Science Society</li>
  <li>Polish Society</li>
  <li>Alternative Investments</li>
  <li>Project Manager @ Yale Undergraduate Consulting Group</li>
</ul>

<p className="about-section-title" style={{ marginTop: 24 }}>OFF CAMPUS...</p>

<ul className="about-list">
  <li>children's books</li>
  <li>running &amp; weight lifting</li>
  <li>calisthenics</li>
  <li>birthday card making</li>
  <li> and dessert teas!</li>
</ul>

<p className="about-section-title" style={{ marginTop: 24 }}>LANGUAGES</p>
<p style={{ fontSize: '1.15rem' }}>English &amp; Polish</p>
      </Window>

      <Window
  id="links"
  title="links"
  className="window-work window-links"
  isOpen={!!openWindows.links}
  zIndex={zIndexes.links || 40}
  position={positions.links}
  onClose={closeWindow}
  onFocus={bringToFront}
  onDrag={handleDrag}
>
  
<p className="about-intro" style={{ fontSize: '1.4rem', color: 'var(--accent-strong)' }}>An incomplete list of some writings and research that I've made, covering a wide variety of topics.</p>

  
  <p className="section-label">research</p>
<div className="writing-index">
  <div className="writing-entry">
    <div className="writing-entry-top">
      <span className="writing-entry-date">/2025</span>
      <a className="writing-entry-title" href="https://www.nber.org/papers/w34602" target="_blank" rel="noopener noreferrer">Human Capital and Development</a>
    <span className="writing-entry-tag">Yale Department of Economics</span>
    </div>
    <p className="writing-entry-desc">National Bureau of Economic Research paper examining how human capital drives innovation and economic growth and how targeted education interventions can mitigate persistent poverty traps.
</p>
    
  </div>
  <div className="writing-entry">
  <div className="writing-entry-top">
    <span className="writing-entry-date">/2025</span>
    <a className="writing-entry-title" href="https://www.arnoldventures.org/stories/randomized-controlled-trial-of-123-moms-to-reduce-maternal-depression-among-new-mothers-and-improve-early-childhood-cognitive-development" target="_blank" rel="noopener noreferrer">123-MOMS: RCT Evaluation of Maternal Mental Health &amp; Child Development</a>
  <span className="writing-entry-tag">Yale School of Management & Medicine</span>
    </div>
  <p className="writing-entry-desc">123-MOMS: RCT evaluation of a three-phase intervention on maternal mental health and child development to lay the foundations for economic opportunity and wellbeing</p>
  
</div>
</div>

  <p className="section-label" style={{ marginTop: 28 }}>published books</p>
  <div className="writing-index">
    <div className="writing-entry">
      <div className="writing-entry-top">
        <span className="writing-entry-date">/2023</span>
        <a className="writing-entry-title" href="https://www.amazon.com/dp/B0C1J1RJHT" target="_blank" rel="noopener noreferrer">Talk To Me Mo</a>
      <span className="writing-entry-tag">Published Literary</span>
    </div>
      <p className="writing-entry-desc">Children's book illustrating how early intervention and nonviolent conflict resolution can help disrupt cycles of gun violence, available on Amazon & Barnes & Noble Stores.</p>
      
    </div>
    
    <div className="writing-entry">
      <div className="writing-entry-top">
        <span className="writing-entry-date">/2023</span>
        <a className="writing-entry-title" href="https://www.amazon.com/dp/B0D1P6T6KY" target="_blank" rel="noopener noreferrer">Making Cents!</a>
      <span className="writing-entry-tag">Published Literary</span>
    </div>
      <p className="writing-entry-desc">Activity-based children's workbook translating complex financial concepts into accessible lessons, equipping elementary and middle school students with foundational skills in saving, budgeting, entrepreneurship, and financial decision-making, available on Amazon.</p>
      
    </div>
  </div>

  <p className="section-label" style={{ marginTop: 28 }}>creative writing</p>
<div className="writing-index">
  <div className="writing-entry">
    <div className="writing-entry-top">
      <span className="writing-entry-date">/2021</span>
      <a className="writing-entry-title" href="https://medium.com/international-junior-economist/the-rise-and-fall-of-toys-r-us-40a188406b2d" target="_blank" rel="noopener noreferrer">The Rise and Fall of Toys 'R' Us</a>
    <span className="writing-entry-tag">Junior Economist</span>
    </div>
    <p className="writing-entry-desc">Examining how mounting debt, strategic inertia, leadership instability, and intensifying e-commerce competition transformed Toys "R" Us from a dominant retail innovator into a bankrupt enterprise.</p>
    
  </div>
  <div className="writing-entry">
    <div className="writing-entry-top">
      <span className="writing-entry-date">/2021</span>
      <a className="writing-entry-title" href="https://medium.com/international-junior-economist/how-businesses-are-taking-advantage-of-tiktok-bc5e2ed70ff" target="_blank" rel="noopener noreferrer">How Businesses Are Taking Advantage of TikTok</a>
    <span className="writing-entry-tag">Junior Economist</span>
    </div>
    <p className="writing-entry-desc">Examining the strategies businesses are using to leverage TikTok's platform for marketing and brand awareness.</p>
    
  </div>
  <div className="writing-entry">
    <div className="writing-entry-top">
      <span className="writing-entry-date">/2022</span>
      <a className="writing-entry-title" href="https://paytonpawprint.com/2022/06/02/fear-escalates-as-violence-continues-to-shake-chicago/" target="_blank" rel="noopener noreferrer">Fear Escalates as Violence Continues to Shake Chicago</a>
    <span className="writing-entry-tag">Paw Print</span>
    </div>
    <p className="writing-entry-desc">Investigating the growing sense of insecurity among Chicago youth and considers how insufficient mental health resources, pandemic-related strain, and limited preventive measures contribute to persistent urban violence.</p>
    
  </div>
  <div className="writing-entry">
    <div className="writing-entry-top">
      <span className="writing-entry-date">/2023</span>
      <a className="writing-entry-title" href="https://paytonpawprint.com/2023/02/22/community-groups-look-to-combat-the-traumatic-cycle-of-gun-violence/" target="_blank" rel="noopener noreferrer">Community Groups Look to Combat the Traumatic Cycle of Gun Violence</a>
    <span className="writing-entry-tag">Paw Print</span>
    </div>
    <p className="writing-entry-desc">Examining the role of community-based initiatives in addressing the root causes of gun violence and supporting those affected by it.</p>
    
  </div>
  <div className="writing-entry">
    <div className="writing-entry-top">
      <span className="writing-entry-date">/2024</span>
      <a className="writing-entry-title" href="https://yaledailynews.com/articles/yale-through-fresh-eyes" target="_blank" rel="noopener noreferrer">Yale Through Fresh Eyes</a>
    <span className="writing-entry-tag">Yale Daily News</span>
    </div>
    <p className="writing-entry-desc">Essay offering a candid, humorous reflection on the disorienting yet formative experience of adapting to Yale's academic, social, and cultural environment as a first-year student.</p>
    
  </div>
  <div className="writing-entry">
    <div className="writing-entry-top">
      <span className="writing-entry-date">/2025</span>
      <a className="writing-entry-title" href="https://yaledailynews.com/articles/winter-break-identity-crisis" target="_blank" rel="noopener noreferrer">The First-Year Winter Break Identity Crisis</a>
    <span className="writing-entry-tag">Yale Daily News</span>
    </div>
    <p className="writing-entry-desc">Essay exploring the liminal identity of a first-year student whose return home for winter break reveals a growing distance from past relationships and an emerging sense of belonging at Yale.</p>
    
  </div>
</div>
</Window>

      <Window
        id="work"
        title="work"
        className="window-work"
        isOpen={!!openWindows.work}
        zIndex={zIndexes.work || 40}
        position={positions.work}
        onClose={closeWindow}
        onFocus={bringToFront}
        onDrag={handleDrag}
      >
        <div className="skills-columns">
  <div>
    <p className="section-label">tools &amp; development</p>
    <div className="tag-list">
      {TOOLS_AND_DEV.map((skill, i) => (
  <span key={skill} className="tag" onMouseEnter={() => sfxOn && playPianoNote(i)}>{skill}</span>
))}
    </div>
  </div>
  <div>
    <p className="section-label">product &amp; analysis</p>
    <div className="tag-list">
      {PRODUCT_AND_ANALYSIS.map((skill, i) => (
  <span key={skill} className="tag" onMouseEnter={() => sfxOn && playPianoNote(i)}>{skill}</span>
))}
    </div>
  </div>
</div>

<p className="section-label" style={{ marginTop: 20 }}>what I&apos;ve built</p>
<div className="project-grid">
          {PROJECTS.map((proj) => {
            const CardTag = proj.link ? 'a' : 'div';
            const linkProps = proj.link
              ? { href: proj.link, target: '_blank', rel: 'noopener noreferrer' }
              : {};
            return (
              <CardTag className="project-card" key={proj.title} {...linkProps}>
                <div className="project-icon">{proj.icon}</div>
                <div className="project-title">
                  {proj.title}
                  {proj.link && <span className="project-link-arrow">↗</span>}
                </div>
                <p className="project-tagline">{proj.tagline}</p>
                <p className="project-desc">{proj.description}</p>
              </CardTag>
            );
          })}
        </div>
      </Window>

      <Window
        id="contact"
        title="socials"
        className="window-contact"
        isOpen={!!openWindows.contact}
        zIndex={zIndexes.contact || 40}
        position={positions.contact}
        onClose={closeWindow}
        onFocus={bringToFront}
        onDrag={handleDrag}
      >
       <p className="section-label">get in touch</p>
<div className="contact-icon-row">
  <a className="contact-icon-btn" href="https://www.linkedin.com/in/viviankaleta/" target="_blank" rel="noopener noreferrer">
    <img src="/icons/linkedin.png" alt="LinkedIn" />
  </a>
 <a className="contact-icon-btn" href="https://github.com/v-kaleta" target="_blank" rel="noopener noreferrer">
  <img src="/icons/github.png" alt="GitHub" />
  </a>
</div>
      </Window>
    </>
  );
}
