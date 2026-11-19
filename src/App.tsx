import { useEffect, useMemo, useState } from 'react';
import matter from 'gray-matter';
import { loadTopics, renderMarkdownPreview, validateTopicMarkdown, type Topic, type TopicSection } from './lib/topics';

const topics = loadTopics();
const categories = ['grammar', 'vocabulary', 'reading', 'writing', 'speaking', 'listening', 'examination', 'mixed-skills'];
const categoryIcons: Record<string, string> = { grammar: 'Aa', vocabulary: '✳', reading: '▤', writing: '✎', speaking: '◖', listening: '♫', examination: '✓', 'mixed-skills': '✦' };
const readStore = (key: string): string[] => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };

function useRoute() {
  const [route, setRoute] = useState(window.location.pathname.startsWith('/admin') ? '#/admin' : (window.location.hash || '#/'));
  useEffect(() => {
    const update = () => setRoute(window.location.pathname.startsWith('/admin') ? '#/admin' : (window.location.hash || '#/'));
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return route;
}

function App() {
  const route = useRoute();
  const [favorites, setFavorites] = useState<string[]>(() => readStore('bimbel-favorites'));
  const [recent, setRecent] = useState<string[]>(() => readStore('bimbel-recent'));
  const [online, setOnline] = useState(navigator.onLine);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [grade, setGrade] = useState('all');
  const [level, setLevel] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [exam, setExam] = useState('all');

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  useEffect(() => localStorage.setItem('bimbel-favorites', JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem('bimbel-recent', JSON.stringify(recent)), [recent]);

  const toggleFavorite = (id: string) => setFavorites((old) => old.includes(id) ? old.filter((x) => x !== id) : [id, ...old]);
  const openTopic = (id: string) => {
    setRecent((old) => [id, ...old.filter((x) => x !== id)].slice(0, 8));
    window.location.hash = `#/topic/${id}`;
  };
  const filtered = useMemo(() => topics.filter((t) => {
    const q = query.trim().toLowerCase();
    const matchesQuery = !q || [t.title, t.summary, ...t.tags, t.body].join(' ').toLowerCase().includes(q);
    return matchesQuery
      && (category === 'all' || t.category === category)
      && (grade === 'all' || t.grades.includes(Number(grade)))
      && (level === 'all' || t.proficiency.starting.includes(level) || t.proficiency.target.includes(level))
      && (difficulty === 'all' || t.difficulty === difficulty)
      && (exam === 'all' || t.exam_relevance.includes(exam));
  }), [query, category, grade, level, difficulty, exam]);

  const routeParts = route.replace(/^#\/?/, '').split('?')[0].split('/').filter(Boolean);
  const isLibrary = routeParts[0] === 'topics';
  const isFavorites = routeParts[0] === 'favorites';
  const isAdmin = window.location.pathname.startsWith('/admin');
  const selectedTopic = routeParts[0] === 'topic' ? topics.find((t) => t.id === routeParts[1]) : undefined;
  useEffect(() => {
    if (isLibrary) {
      const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
      setCategory(params.get('category') || 'all');
    }
  }, [route, isLibrary]);

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="/#/" aria-label="English Bimbel home"><span className="brand-mark">EB</span><span><b>English Bimbel</b><small>TEACHING COMPANION</small></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a className={!isLibrary && !isFavorites && !isAdmin && !selectedTopic ? 'active' : ''} href="/#/">Home</a>
        <a className={isLibrary ? 'active' : ''} href="/#/topics">Topics</a>
        <a className={isFavorites ? 'active' : ''} href="/#/favorites">Favorites</a>
        <a className={isAdmin ? 'active' : ''} href="/admin/">Admin</a>
      </nav>
      <div className={`connection ${online ? 'is-online' : 'is-offline'}`}><span />{online ? 'Online' : 'Offline'}</div>
    </header>

    <main className="main-content">
      {selectedTopic ? <TopicPage key={selectedTopic.id} topic={selectedTopic} isFavorite={favorites.includes(selectedTopic.id)} onFavorite={() => toggleFavorite(selectedTopic.id)} />
        : isAdmin ? <AdminPage />
        : isFavorites ? <LibraryPage title="Your favorites" items={topics.filter((t) => favorites.includes(t.id))} onOpen={openTopic} favorites={favorites} onFavorite={toggleFavorite} />
        : isLibrary ? <>
          <section className="page-heading"><div><span className="eyebrow">THE TOPIC LIBRARY</span><h1>Find your next lesson.</h1><p>Search the teaching library and filter by the class or skill you need.</p></div></section>
          <SearchAndFilters {...{query,setQuery,category,setCategory,grade,setGrade,level,setLevel,difficulty,setDifficulty,exam,setExam}} />
          <LibraryPage title={`${filtered.length} ${filtered.length === 1 ? 'topic' : 'topics'} found`} items={filtered} onOpen={openTopic} favorites={favorites} onFavorite={toggleFavorite} />
        </>
        : <Dashboard topics={topics} recent={recent} favorites={favorites} onOpen={openTopic} onFavorite={toggleFavorite} />}
    </main>

    <footer className="footer"><span>Made for teaching, not busywork.</span><span>English Bimbel · v0.1</span></footer>
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <a href="/#/" className={!isLibrary && !isFavorites && !isAdmin && !selectedTopic ? 'active' : ''}><span>⌂</span>Home</a>
      <a href="/#/topics" className={isLibrary ? 'active' : ''}><span>▦</span>Topics</a>
      <a href="/#/favorites" className={isFavorites ? 'active' : ''}><span>♡</span>Saved</a>
      <a href="/admin/" className={isAdmin ? 'active' : ''}><span>⚙</span>Admin</a>
    </nav>
  </div>;
}

function Dashboard({ topics, recent, favorites, onOpen, onFavorite }: { topics: Topic[]; recent: string[]; favorites: string[]; onOpen: (id: string) => void; onFavorite: (id: string) => void }) {
  const [search, setSearch] = useState('');
  const results = topics.filter((t) => !search || [t.title, t.summary, ...t.tags].join(' ').toLowerCase().includes(search.toLowerCase()));
  const recentTopics = recent.map((id) => topics.find((t) => t.id === id)).filter(Boolean) as Topic[];
  const favoriteTopics = favorites.map((id) => topics.find((t) => t.id === id)).filter(Boolean) as Topic[];
  return <>
    <section className="hero-card">
      <div className="hero-copy"><span className="eyebrow light">YOUR CLASSROOM SIDEKICK</span><h1>Good teaching.<br /><em>Less prep.</em></h1><p>Practical English lessons, clear examples, and ready-to-use practice — right from your phone.</p><div className="hero-actions"><a className="button button-white" href="/#/topics">Explore topics <span>→</span></a><span className="hero-note">Phone + whiteboard ready</span></div></div>
      <div className="hero-art" aria-hidden="true"><div className="sun-disc">Aa</div><div className="float-card card-one">V2 <b>WENT</b></div><div className="float-card card-two">had + V3 <b>GONE</b></div><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="sparkle">✦</div></div>
    </section>
    <section className="quick-search"><label htmlFor="home-search">What are you teaching today?</label><div className="search-box"><span>⌕</span><input id="home-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Try: past tense, reading, vocabulary..." /><a href={`/#/topics`} aria-label="Open topic library">→</a></div>
      {search && <div className="quick-results">{results.slice(0, 4).map((t) => <button key={t.id} onClick={() => onOpen(t.id)}>{t.title}<span>Open →</span></button>)}{results.length === 0 && <p>No matching topics yet.</p>}</div>}
    </section>
    <section className="section-block"><div className="section-title"><div><span className="eyebrow">PICK UP WHERE YOU LEFT OFF</span><h2>Recently opened</h2></div><a href="/#/topics" className="text-link">All topics →</a></div>
      {recentTopics.length ? <div className="card-grid">{recentTopics.slice(0, 3).map((t) => <TopicCard key={t.id} topic={t} onOpen={onOpen} isFavorite={favorites.includes(t.id)} onFavorite={onFavorite} />)}</div> : <div className="empty-state"><span>↗</span><b>Your recent topics will appear here.</b><p>Open a topic to keep it handy for next time.</p><a href="/#/topics">Browse the library →</a></div>}
    </section>
    <section className="section-block"><div className="section-title"><div><span className="eyebrow">QUICK BROWSE</span><h2>Browse by category</h2></div></div><div className="category-grid">{categories.map((c) => <a className="category-tile" href={`/#/topics?category=${c}`} key={c}><span className="category-icon">{categoryIcons[c]}</span><b>{c.replace('-', ' ')}</b><span className="tile-arrow">↗</span></a>)}</div></section>
    <section className="section-block"><div className="section-title"><div><span className="eyebrow">SAVED FOR LATER</span><h2>Your favorites</h2></div><a href="/#/favorites" className="text-link">View saved →</a></div>
      {favoriteTopics.length ? <div className="card-grid">{favoriteTopics.slice(0, 3).map((t) => <TopicCard key={t.id} topic={t} onOpen={onOpen} isFavorite onFavorite={onFavorite} />)}</div> : <p className="muted-line">Tap the heart on any topic card to save it here.</p>}
    </section>
    <section className="section-block"><div className="section-title"><div><span className="eyebrow">FRESH FROM THE LIBRARY</span><h2>Recently added</h2></div></div><div className="card-grid">{[...topics].sort((a,b) => String(b.updated).localeCompare(String(a.updated))).slice(0, 3).map((t) => <TopicCard key={t.id} topic={t} onOpen={onOpen} isFavorite={favorites.includes(t.id)} onFavorite={onFavorite} />)}</div></section>
  </>;
}

function SearchAndFilters(props: any) {
  return <section className="filters-panel">
    <div className="search-box library-search"><span>⌕</span><input aria-label="Search topics" value={props.query} onChange={(e) => props.setQuery(e.target.value)} placeholder="Search title, summary, or keyword..." /><button onClick={() => props.setQuery('')} aria-label="Clear search">×</button></div>
    <div className="filter-row">
      <label>Category<select value={props.category} onChange={(e) => props.setCategory(e.target.value)}><option value="all">All categories</option>{categories.map((x) => <option key={x} value={x}>{x}</option>)}</select></label>
      <label>Grade<select value={props.grade} onChange={(e) => props.setGrade(e.target.value)}><option value="all">All grades</option>{[7,8,9,10,11,12].map((x) => <option key={x} value={x}>Grade {x}</option>)}</select></label>
      <label>Proficiency<select value={props.level} onChange={(e) => props.setLevel(e.target.value)}><option value="all">Any level</option>{['pre-a1','a1','a2','b1','b2'].map((x) => <option key={x} value={x}>{x.toUpperCase()}</option>)}</select></label>
      <label>Difficulty<select value={props.difficulty} onChange={(e) => props.setDifficulty(e.target.value)}><option value="all">Any difficulty</option>{['beginner','elementary','intermediate','advanced'].map((x) => <option key={x}>{x}</option>)}</select></label>
      <label>Exam relevance<select value={props.exam} onChange={(e) => props.setExam(e.target.value)}><option value="all">Any</option>{['school-assessment','sas','tka','utbk-snbt'].map((x) => <option key={x}>{x}</option>)}</select></label>
    </div>
  </section>;
}

function LibraryPage({ title, items, onOpen, favorites, onFavorite }: { title: string; items: Topic[]; onOpen: (id: string) => void; favorites: string[]; onFavorite: (id: string) => void }) {
  return <section className="section-block library-results"><div className="section-title"><h2>{title}</h2></div>
    {items.length ? <div className="card-grid">{items.map((t) => <TopicCard key={t.id} topic={t} onOpen={onOpen} isFavorite={favorites.includes(t.id)} onFavorite={onFavorite} />)}</div> : <div className="empty-state"><span>⌕</span><b>No topics match those filters.</b><p>Try removing a filter or searching for a different keyword.</p></div>}
  </section>;
}

function TopicCard({ topic, onOpen, isFavorite, onFavorite }: { topic: Topic; onOpen: (id: string) => void; isFavorite: boolean; onFavorite: (id: string) => void }) {
  return <article className="topic-card">
    <div className="topic-card-top"><span className="category-pill">{topic.category}</span><button className={`heart-button ${isFavorite ? 'saved' : ''}`} onClick={() => onFavorite(topic.id)} aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>{isFavorite ? '♥' : '♡'}</button></div>
    <button className="card-main" onClick={() => onOpen(topic.id)}><h3>{topic.title}</h3><p>{topic.summary}</p><span className="card-open">Open topic <b>→</b></span></button>
    <div className="card-meta"><span>Grades {topic.grades.join(', ')}</span><span>{topic.proficiency.starting.join('/')} → {topic.proficiency.target.join('/')}</span><span className={`difficulty difficulty-${topic.difficulty}`}>{topic.difficulty}</span></div>
    {topic.exam_relevance.length > 0 && <div className="tag-row">{topic.exam_relevance.map((x) => <span key={x}>{x}</span>)}</div>}
  </article>;
}

function TopicPage({ topic, isFavorite, onFavorite }: { topic: Topic; isFavorite: boolean; onFavorite: () => void }) {
  const [openKeys, setOpenKeys] = useState<Set<string>>(() => new Set());
  const [textScale, setTextScale] = useState(1);
  const allKeys = topic.sections.flatMap((s) => [`${s.id}`, ...(s.stages || []).map((st) => `${s.id}-${st.id}`)]);
  const toggle = (key: string) => setOpenKeys((old) => { const next = new Set(old); next.has(key) ? next.delete(key) : next.add(key); return next; });
  const copyText = async () => { try { await navigator.clipboard.writeText(`${topic.title}\n\n${topic.body}`); } catch { window.alert('Copy is not available in this browser context.'); } };
  return <article className="topic-view" style={{ '--reading-scale': textScale } as any}>
    <a className="back-link" href="/#/topics">← Back to topics</a>
    <header className="topic-hero"><div className="topic-hero-top"><span className="category-pill">{topic.category}</span><span className="updated-label">Updated {String(topic.updated)}</span></div><h1>{topic.title}</h1><p>{topic.summary}</p><div className="topic-meta-row"><span>Grades {topic.grades.join(', ')}</span><span>Starting: {topic.proficiency.starting.join(', ')}</span><span>Target: {topic.proficiency.target.join(', ')}</span><span>{topic.difficulty}</span></div><button className={`save-topic ${isFavorite ? 'saved' : ''}`} onClick={onFavorite}>{isFavorite ? '♥ Saved' : '♡ Save topic'}</button></header>
    <div className="topic-toolbar"><div className="toolbar-group"><button onClick={() => setOpenKeys(new Set(allKeys))}>＋ Expand all</button><button onClick={() => setOpenKeys(new Set())}>－ Collapse all</button></div><div className="toolbar-group"><button onClick={() => setTextScale((v) => Math.max(.9, +(v - .05).toFixed(2)))} aria-label="Decrease text size">A−</button><button onClick={() => setTextScale((v) => Math.min(1.2, +(v + .05).toFixed(2)))} aria-label="Increase text size">A＋</button><button onClick={copyText}>Copy topic</button></div></div>
    <div className="accordion-list" style={{ fontSize: `calc(1rem * ${textScale})` }}>
      {topic.sections.map((section) => <TopicAccordion key={section.id} section={section} isOpen={openKeys.has(section.id)} openKeys={openKeys} onToggle={toggle} />)}
    </div>
    <div className="topic-end-note"><span>✦</span><div><b>Teach the meaning, then the form.</b><p>Adjust the support to what students demonstrate — not just their grade level.</p></div></div>
  </article>;
}

function TopicAccordion({ section, isOpen, openKeys, onToggle }: { section: TopicSection; isOpen: boolean; openKeys: Set<string>; onToggle: (key: string) => void }) {
  return <section className={`accordion-section ${isOpen ? 'is-open' : ''}`}>
    <h2><button className="accordion-trigger" aria-expanded={isOpen} onClick={() => onToggle(section.id)}><span className="accordion-title">{section.title}</span><span className="accordion-chevron" aria-hidden="true">{isOpen ? '−' : '+'}</span></button></h2>
    {isOpen && <div className="accordion-content">
      {section.html && <div className="markdown-content" dangerouslySetInnerHTML={{ __html: section.html }} />}
      {section.stages?.map((stage) => {
        const key = `${section.id}-${stage.id}`;
        const stageOpen = openKeys.has(key);
        return <section className={`stage-accordion ${stageOpen ? 'is-open' : ''}`} key={stage.id}>
          <h3><button className="stage-trigger" aria-expanded={stageOpen} onClick={() => onToggle(key)}><span>{stage.title}</span><span aria-hidden="true">{stageOpen ? '−' : '+'}</span></button></h3>
          {stageOpen && <div className="markdown-content stage-content" dangerouslySetInnerHTML={{ __html: stage.html }} />}
        </section>;
      })}
    </div>}
  </section>;
}

function AdminPage() {
  const [raw, setRaw] = useState('');
  const [filename, setFilename] = useState('');
  const [meta, setMeta] = useState<any>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const preview = raw ? renderMarkdownPreview(raw) : '';
  const effectiveFilename = filename || `${(raw.match(/^id:\s*([a-z0-9-]+)/m) || [])[1] || ''}.md`;

  const readMeta = (source: string) => {
    try {
      const data = matter(source).data as any;
      const dateValue = data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : String(data.updated || '');
      return {
        title: data.title || '', category: data.category || 'grammar', summary: data.summary || '',
        grades: Array.isArray(data.grades) ? data.grades.join(', ') : '',
        starting: Array.isArray(data.proficiency?.starting) ? data.proficiency.starting.join(', ') : '',
        target: Array.isArray(data.proficiency?.target) ? data.proficiency.target.join(', ') : '',
        difficulty: data.difficulty || 'beginner', exam_relevance: Array.isArray(data.exam_relevance) ? data.exam_relevance.join(', ') : '',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : '', status: data.status || 'draft', updated: dateValue,
      };
    } catch { return null; }
  };
  const loadRaw = (source: string) => { setRaw(source); setMeta(readMeta(source)); setErrors([]); };
  const patchMeta = (key: string, value: string) => {
    if (!raw) return;
    try {
      const parsed = matter(raw);
      const data = { ...parsed.data } as any;
      if (data.updated instanceof Date) data.updated = data.updated.toISOString().slice(0, 10);
      if (key === 'grades' || key === 'starting' || key === 'target' || key === 'tags' || key === 'exam_relevance') {
        const values = value.split(',').map((x) => x.trim()).filter(Boolean);
        if (key === 'grades') data.grades = values.map(Number).filter(Number.isFinite);
        else if (key === 'starting' || key === 'target') data.proficiency = { ...(data.proficiency || {}), [key]: values };
        else data[key] = values;
      } else data[key] = value;
      const nextRaw = matter.stringify(parsed.content, data);
      setRaw(nextRaw);
      setMeta(readMeta(nextRaw));
      setErrors([]);
    } catch { setMeta(null); }
  };
  const validate = () => {
    const next = validateTopicMarkdown(raw, effectiveFilename);
    setErrors(next);
    setMessage(next.length ? 'Please fix the validation issues before saving.' : 'Structure looks valid. Review the preview before publishing.');
    return next.length === 0;
  };
  const upload = async (file?: File) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.md')) { setMessage('Please choose a .md file.'); return; }
    setFilename(file.name);
    loadRaw(await file.text());
    setMessage('File loaded. Review metadata, then validate before saving.');
  };
  const save = async () => {
    if (!validate()) return;
    if (!window.confirm('Save this topic to the connected GitHub repository? The topic status in the YAML determines whether it is public.')) return;
    setBusy(true); setMessage('Sending the topic to the protected publishing endpoint…');
    try {
      const response = await fetch('/api/admin/save', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ filename: effectiveFilename, content: raw }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Publishing failed.');
      setMessage(`Saved to GitHub. Commit: ${data.commit || 'created'}. A deployment should start automatically.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Publishing endpoint unavailable. Configure Cloudflare Access and GitHub secrets first.');
    } finally { setBusy(false); }
  };
  return <section className="admin-page">
    <div className="page-heading"><div><span className="eyebrow">OWNER WORKSPACE</span><h1>Topic publishing</h1><p>Upload, edit metadata, validate, preview, and save a Markdown topic.</p></div></div>
    <div className="admin-warning"><b>Protected publishing:</b> deploy this route behind Cloudflare Access. The server also verifies the Access JWT and owner allowlist. GitHub credentials stay server-side.</div>
    <div className="admin-panel">
      <div className="admin-toolbar"><label className="button button-primary upload-button">Choose .md file<input type="file" accept=".md,text/markdown" onChange={(e) => upload(e.target.files?.[0])} hidden /></label><span className="file-name">{filename || (effectiveFilename !== '.md' ? effectiveFilename : 'No file selected')}</span><button className="button button-soft" onClick={validate} disabled={!raw}>Validate</button><button className="button button-primary" onClick={save} disabled={!raw || busy}>{busy ? 'Saving…' : 'Save to GitHub'}</button></div>
      {meta && <div className="metadata-editor"><div className="preview-heading"><h2>Structured metadata</h2><span>Changes sync to YAML</span></div><div className="metadata-grid">
        <label>Title<input value={meta.title} onChange={(e) => patchMeta('title', e.target.value)} /></label>
        <label>Category<select value={meta.category} onChange={(e) => patchMeta('category', e.target.value)}>{categories.map((x) => <option key={x} value={x}>{x}</option>)}</select></label>
        <label className="wide-field">Summary<input value={meta.summary} onChange={(e) => patchMeta('summary', e.target.value)} /></label>
        <label>Grades (comma-separated)<input value={meta.grades} onChange={(e) => patchMeta('grades', e.target.value)} placeholder="10, 11, 12" /></label>
        <label>Starting proficiency<input value={meta.starting} onChange={(e) => patchMeta('starting', e.target.value)} placeholder="pre-a1, a1" /></label>
        <label>Target proficiency<input value={meta.target} onChange={(e) => patchMeta('target', e.target.value)} placeholder="a2, b1" /></label>
        <label>Difficulty<select value={meta.difficulty} onChange={(e) => patchMeta('difficulty', e.target.value)}>{['beginner','elementary','intermediate','advanced'].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label>Status<select value={meta.status} onChange={(e) => patchMeta('status', e.target.value)}>{['draft','published','archived'].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label>Updated<input type="date" value={meta.updated} onChange={(e) => patchMeta('updated', e.target.value)} /></label>
        <label>Exam relevance<input value={meta.exam_relevance} onChange={(e) => patchMeta('exam_relevance', e.target.value)} placeholder="school-assessment, sas" /></label>
        <label className="wide-field">Tags<input value={meta.tags} onChange={(e) => patchMeta('tags', e.target.value)} placeholder="grammar, verbs, recount" /></label>
      </div></div>}
      <label className="field-label" htmlFor="topic-editor">Raw Markdown source</label><textarea id="topic-editor" className="markdown-editor" value={raw} onChange={(e) => loadRaw(e.target.value)} placeholder="Paste a complete topic Markdown file, including YAML frontmatter…" />
      {errors.length > 0 && <div className="validation-box error"><b>Validation issues</b><ul>{errors.map((e) => <li key={e}>{e}</li>)}</ul></div>}
      {message && <div className={`validation-box ${errors.length ? 'error' : 'success'}`}>{message}</div>}
      <div className="preview-heading"><h2>Rendered preview</h2><span>Sanitized Markdown</span></div><div className="admin-preview markdown-content" dangerouslySetInnerHTML={{ __html: preview || '<p>Your topic preview will appear here.</p>' }} />
    </div>
  </section>;
}

export default App;
