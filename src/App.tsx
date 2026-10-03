import { useEffect, useState, type FormEvent } from "react";

type Project = { title: string; description: string; technologies: string[]; url: string };
type Status = "loading" | "ready" | "error";

const NAME = "Max Myers";
const TAGLINE = "I build engineering systems that feel simple.";

export default function App() {
  return (
    <div className="page">
      <div className="grid-bg" aria-hidden="true" />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <footer className="footer">
        <span className="mono">© {new Date().getFullYear()} {NAME}</span>
        <span className="mono muted">built with an AI coding agent · verified by hand</span>
      </footer>
    </div>
  );
}

function Navbar() {
  return (
    <nav className="nav">
      <a href="#top" className="brand mono">
        <span className="brand-dot" /> {NAME.toLowerCase().replace(" ", "")}
      </a>
      <div className="nav-links">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section id="top" className="hero">
      <div className="pill mono">
        <span className="ping" /> System Status: ONLINE
      </div>
      <h1 className="h1">
        {TAGLINE.replace("simple.", "")}
        <span className="gradient">simple</span>.
      </h1>
      <p className="lede">
        No matter how complex they are underneath. Technical founder. Previously shipped browser-platform
        features at Microsoft. Now building a coding-education platform that runs all execution and AI
        inference on-device via WebAssembly.
      </p>
      <div className="cta-row">
        <a href="#work" className="btn btn-primary mono">Explore Projects →</a>
        <a href="#contact" className="btn btn-ghost mono">Get in touch</a>
      </div>
      <div className="stack mono">
        <span>▣ WASM</span>
        <span>▤ Infra</span>
        <span>▥ Chromium</span>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <header className="section-head">
        <h2>About</h2>
        <span className="mono muted">/about/README.md</span>
      </header>
      <div className="card prose">
        <p>
          I like the seam between the browser and the operating system: the place where a web app stops
          feeling like a web page. I have shipped there at scale, and now I teach people to build there.
        </p>
        <p>
          Currently studying at Maryland and looking for a summer internship where I can own a system end
          to end.
        </p>
      </div>
    </section>
  );
}

function Projects() {
  const [status, setStatus] = useState<Status>("loading");
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Project[]>;
      })
      .then((data) => {
        if (cancelled) return;
        setProjects(Array.isArray(data) ? data : []);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="work" className="section">
      <header className="section-head">
        <div>
          <h2>Featured Work</h2>
          <span className="mono muted">Index of /projects/public</span>
        </div>
        {status === "ready" && <span className="mono muted">Total: {projects.length} items</span>}
      </header>

      {status === "loading" && (
        <p className="state mono" role="status">
          <span className="spinner" /> Loading projects…
        </p>
      )}
      {status === "error" && (
        <p className="state state-error mono" role="alert">
          Could not load projects. The API returned an error — try again in a moment.
        </p>
      )}
      {status === "ready" && projects.length === 0 && (
        <p className="state mono">No projects published yet. Check back soon.</p>
      )}

      {status === "ready" && projects.length > 0 && (
        <div className="grid">
          {projects.map((p) => (
            <article key={p.title} className="card project">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="tags mono">
                {p.technologies.map((t) => (
                  <span key={t}>#{t}</span>
                ))}
              </div>
              <a className="link" href={p.url} target="_blank" rel="noopener noreferrer">
                View project ↗
              </a>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = (await res.json()) as { message?: string; error?: string };
      setResult({ ok: res.ok, message: body.message ?? body.error ?? (res.ok ? "Sent." : "Something went wrong.") });
      if (res.ok) setForm({ name: "", email: "", message: "" });
    } catch {
      setResult({ ok: false, message: "Network error — please try again." });
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="section">
      <header className="section-head">
        <h2>Contact</h2>
        <span className="mono muted">POST /api/contact</span>
      </header>
      <form className="card form" onSubmit={onSubmit} noValidate>
        <label>
          <span className="mono">name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ada Lovelace" />
        </label>
        <label>
          <span className="mono">email</span>
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ada@example.com" />
        </label>
        <label>
          <span className="mono">message</span>
          <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="What are you building?" />
        </label>
        <div className="form-row">
          <button type="submit" className="btn btn-primary mono" disabled={sending}>
            {sending ? "Sending…" : "Send message"}
          </button>
          {result && (
            <p className={`mono ${result.ok ? "ok" : "err"}`} role={result.ok ? "status" : "alert"}>
              {result.message}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
