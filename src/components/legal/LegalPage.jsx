import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ArrowUp, ArrowUpRight, Info, Mail, Phone, Printer, BookOpen } from 'lucide-react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { LEGAL_INFO } from '../../content/legal/info';

const DOCS = [
  { to: '/terminos', labelKey: 'footer.terms' },
  { to: '/privacidad', labelKey: 'footer.privacy' },
];

// Texto con **negrita** y [enlaces](/ruta | mailto: | https:)
function Rich({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**')) return <strong key={i} className="font-semibold text-ink-900">{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const cls = 'font-medium text-accent-deep underline decoration-accent-deep/30 underline-offset-4 hover:decoration-accent-deep';
      return link[2].startsWith('/')
        ? <Link key={i} to={link[2]} className={cls}>{link[1]}</Link>
        : <a key={i} href={link[2]} className={cls}>{link[1]}</a>;
    }
    return part;
  });
}

function Block({ block }) {
  switch (block.type) {
    case 'p':
      return <p className="text-[17px] leading-[1.8] text-ink-900/75"><Rich text={block.text} /></p>;

    case 'list':
      return (
        <ul className="space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-4 text-[17px] leading-[1.75] text-ink-900/75">
              <span aria-hidden="true" className="mt-[0.7em] w-1.5 h-1.5 rounded-full bg-sand-deep shrink-0" />
              <span><Rich text={item} /></span>
            </li>
          ))}
        </ul>
      );

    case 'steps':
      return (
        <ol className="grid sm:grid-cols-2 gap-px bg-ink-900/10 rounded-2xl overflow-hidden border border-ink-900/10">
          {block.items.map((step, i) => (
            <li key={step.title} className="bg-ivory-100 p-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-display italic text-3xl text-sand-deep leading-none">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-semibold text-ink-900">{step.title}</span>
              </div>
              <p className="text-[15px] leading-relaxed text-ink-900/70"><Rich text={step.text} /></p>
            </li>
          ))}
        </ol>
      );

    case 'callout': {
      const warn = block.tone === 'warn';
      const Icon = warn ? AlertTriangle : Info;
      return (
        <aside className={`flex gap-4 rounded-2xl p-5 md:p-6 border ${warn ? 'bg-accent-soft/35 border-accent-deep/25' : 'bg-sand-soft/40 border-sand-deep/25'}`}>
          <Icon size={20} className={`shrink-0 mt-0.5 ${warn ? 'text-accent-deep' : 'text-sand-deep'}`} aria-hidden="true" />
          <div>
            <p className="font-semibold text-ink-900 mb-1">{block.title}</p>
            <p className="text-[15px] leading-relaxed text-ink-900/75"><Rich text={block.text} /></p>
          </div>
        </aside>
      );
    }

    case 'table':
      return (
        <>
        {/* En movil cada fila es una tarjeta: las tablas de 3 columnas no caben a 390px */}
        <ul className="sm:hidden space-y-3">
          {block.rows.map((row, r) => (
            <li key={r} className="rounded-2xl border border-ink-900/10 p-4">
              <p className="font-medium text-ink-900">{row[0]}</p>
              {row.slice(1).map((cell, c) => (
                <p key={c} className="mt-2 text-[15px] leading-relaxed text-ink-900/70">
                  {block.head[c + 1] && <span className="block text-[10px] uppercase tracking-label text-ink-900/45 mb-0.5">{block.head[c + 1]}</span>}
                  {cell}
                </p>
              ))}
            </li>
          ))}
        </ul>
        <div className="hidden sm:block overflow-x-auto rounded-2xl border border-ink-900/10">
          <table className="w-full text-left text-[15px]">
            <thead className="bg-ink-900/[0.04]">
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} scope="col" className="px-5 py-3 text-[11px] font-medium uppercase tracking-label text-ink-900/50 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-900/10">
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c} className={`px-5 py-4 align-top ${c === 0 ? 'font-medium text-ink-900 min-w-[9rem]' : 'text-ink-900/70 min-w-[12rem]'}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      );

    default:
      return null;
  }
}

function blockWords(block) {
  const texts = [block.text, block.title, ...(block.items || []).map((i) => (typeof i === 'string' ? i : `${i.title} ${i.text}`)), ...(block.rows || []).flat()];
  return texts.filter(Boolean).join(' ').split(/\s+/).length;
}

/**
 * Plantilla compartida de Terminos y Privacidad: portada oscura con lo esencial,
 * hoja marfil de lectura con indice fijo, seccion activa, barra de progreso y version imprimible.
 */
export default function LegalPage({ doc, number, path }) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const { title, intro, highlights, sections } = doc;
  const [active, setActive] = useState(sections[0]?.id);
  const [progress, setProgress] = useState(0);

  const readingMinutes = useMemo(() => {
    const words = sections.reduce((n, s) => n + s.blocks.reduce((m, b) => m + blockWords(b), 0), 0);
    return Math.max(1, Math.round(words / 200));
  }, [sections]);

  const updated = new Date(`${LEGAL_INFO.lastUpdated}T00:00:00`)
    .toLocaleDateString(isEn ? 'en-US' : 'es-PE', { day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: '-25% 0px -65% 0px' }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  const goTo = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  };

  const other = DOCS.find((d) => d.to !== path);

  return (
    <div className="bg-ink-900 text-ivory min-h-screen print:bg-white print:text-ink-900">
      <Helmet>
        <title>{title} | {LEGAL_INFO.name}</title>
        <meta name="description" content={intro} />
      </Helmet>

      <div className="print:hidden"><Navbar /></div>
      <div
        aria-hidden="true"
        className="fixed top-0 inset-x-0 h-[3px] z-[60] bg-accent origin-left print:hidden"
        style={{ transform: `scaleX(${progress})` }}
      />

      {/* Portada */}
      <header className="relative overflow-hidden pt-32 pb-16 lg:pt-44 lg:pb-24">
        <span aria-hidden="true" className="pointer-events-none select-none absolute -right-6 -top-10 lg:top-4 font-display italic leading-none text-[16rem] lg:text-[30rem] text-ivory/[0.035] print:hidden">
          {number}
        </span>
        <div className="relative max-w-[1400px] mx-auto px-5 lg:px-10">
          <nav aria-label={t('legal.docs_label')} className="inline-flex flex-wrap gap-1 p-1 mb-12 rounded-full border border-ivory/15 print:hidden">
            {DOCS.map((d) => {
              const current = d.to === path;
              return (
                <Link
                  key={d.to}
                  to={d.to}
                  aria-current={current ? 'page' : undefined}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${current ? 'bg-ivory text-ink-900 font-medium' : 'text-ivory/60 hover:text-ivory'}`}
                >
                  {t(d.labelKey)}
                </Link>
              );
            })}
          </nav>

          <span className="eyebrow flex text-sand mb-6 animate-fade-up">
            <span className="section-num text-base normal-case tracking-normal">{number}</span>
            <span className="w-10 h-px bg-sand/50" />
            {t('legal.eyebrow')}
          </span>
          <h1 className="font-display text-[3.4rem] sm:text-7xl lg:text-[7.5rem] font-medium leading-[0.92] text-balance max-w-5xl animate-fade-up print:text-5xl">
            {title}
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ivory/60 animate-fade-up print:text-ink-900/70">{intro}</p>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm">
            <dl className="flex flex-wrap gap-x-8 gap-y-3">
              {[[t('legal.updated'), updated], [t('legal.reading'), t('legal.reading_min', { count: readingMinutes })], [t('legal.version'), LEGAL_INFO.version]].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[10px] uppercase tracking-label text-ivory/40 print:text-ink-900/50">{k}</dt>
                  <dd className="mt-1 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
            <button type="button" onClick={() => window.print()} className="btn-ghost !min-h-[40px] !py-2 !px-4 text-sm print:hidden">
              <Printer size={15} /> {t('legal.print')}
            </button>
          </div>
        </div>
      </header>

      {/* Lo esencial */}
      <section aria-labelledby="esencial" className="max-w-[1400px] mx-auto px-5 lg:px-10 pb-16 lg:pb-24 print:hidden">
        <h2 id="esencial" className="eyebrow text-ivory/40 mb-6">{t('legal.essentials')}</h2>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {highlights.map((h) => (
            <li key={h.label} className="ticket-dark card-hover p-6 flex flex-col">
              <span className="font-display text-5xl font-semibold text-accent leading-none">{h.value}</span>
              <span className="mt-5 text-[11px] uppercase tracking-label text-sand">{h.label}</span>
              <p className="mt-2 text-sm leading-relaxed text-ivory/55">{h.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Hoja de lectura */}
      <main className="bg-ivory-100 text-ink-900 rounded-t-[36px] lg:rounded-t-[56px] print:rounded-none print:bg-white">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-10 py-14 lg:py-24 grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Indice movil */}
          <details className="lg:hidden rounded-2xl border border-ink-900/10 bg-ivory print:hidden">
            <summary className="cursor-pointer list-none flex items-center justify-between px-5 py-4 font-medium">
              <span className="flex items-center gap-3"><BookOpen size={18} className="text-sand-deep" /> {t('legal.contents')}</span>
              <span className="text-sm text-ink-900/45">{t('legal.sections_count', { count: sections.length })}</span>
            </summary>
            <ol className="px-5 pb-4 space-y-1">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} onClick={(e) => goTo(e, s.id)} className="flex gap-3 py-2 text-ink-900/70">
                    <span className="font-display italic text-sand-deep w-6">{i + 1}</span>{s.title}
                  </a>
                </li>
              ))}
            </ol>
          </details>

          {/* Indice de escritorio */}
          <aside className="hidden lg:block lg:col-span-3 print:hidden">
            <nav aria-label={t('legal.contents')} className="sticky top-28">
              <p className="eyebrow text-ink-900/40 mb-5">{t('legal.contents')}</p>
              <ol className="relative border-l border-ink-900/10">
                {sections.map((s, i) => {
                  const isActive = active === s.id;
                  return (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        onClick={(e) => goTo(e, s.id)}
                        aria-current={isActive ? 'location' : undefined}
                        className={`relative flex gap-3 py-2 pl-5 text-sm transition-colors ${isActive ? 'text-ink-900 font-medium' : 'text-ink-900/45 hover:text-ink-900'}`}
                      >
                        <span aria-hidden="true" className={`absolute -left-px top-1.5 bottom-1.5 w-[2px] rounded-full transition-colors ${isActive ? 'bg-accent-deep' : 'bg-transparent'}`} />
                        <span className="font-display italic text-sand-deep w-5 shrink-0">{i + 1}</span>
                        {s.title}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>
          </aside>

          <article className="lg:col-span-8 lg:col-start-5 min-w-0">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-t`} className="scroll-mt-28 border-t border-ink-900/10 first:border-t-0 first:pt-0 pt-12 pb-12 break-inside-avoid-page">
                <div className="flex items-baseline gap-5 mb-7">
                  <span aria-hidden="true" className="font-display italic text-4xl lg:text-5xl text-sand-deep leading-none w-12 shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 id={`${s.id}-t`} className="font-display text-3xl lg:text-[2.6rem] font-medium leading-tight text-balance">{s.title}</h2>
                </div>
                <div className="space-y-6 lg:pl-[4.25rem]">
                  {s.blocks.map((b, j) => <Block key={j} block={b} />)}
                </div>
              </section>
            ))}

            {/* Contacto */}
            <div className="ticket !bg-ink-900 !text-ivory mt-8 overflow-visible print:hidden">
              <div className="p-7 md:p-10">
                <p className="eyebrow text-sand mb-4">{t('legal.questions')}</p>
                <p className="font-display text-3xl md:text-4xl font-medium leading-tight max-w-xl">{t('legal.write_us')}</p>
              </div>
              <div className="relative border-t-2 border-dashed border-ivory/15">
                <span aria-hidden="true" className="notch !bg-ivory-100 -top-3 -left-3" />
                <span aria-hidden="true" className="notch !bg-ivory-100 -top-3 -right-3" />
              </div>
              <div className="p-7 md:p-10 grid sm:grid-cols-3 gap-4">
                <a href={`mailto:${LEGAL_INFO.email}`} className="flex items-center gap-3 text-ivory/80 hover:text-accent transition-colors min-w-0">
                  <Mail size={18} className="shrink-0 text-accent" /><span className="truncate">{LEGAL_INFO.email}</span>
                </a>
                <a href={`tel:${LEGAL_INFO.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-ivory/80 hover:text-accent transition-colors">
                  <Phone size={18} className="shrink-0 text-accent" />{LEGAL_INFO.phone}
                </a>
                <Link to="/libro-reclamaciones" className="flex items-center gap-3 text-ivory/80 hover:text-accent transition-colors">
                  <BookOpen size={18} className="shrink-0 text-accent" />{t('legal.complaints')}
                </Link>
              </div>
            </div>

            {other && (
              <Link to={other.to} className="group mt-6 flex items-center justify-between gap-6 rounded-[22px] border border-ink-900/10 p-7 md:p-8 hover:border-ink-900/30 transition-colors print:hidden">
                <span>
                  <span className="block text-[11px] uppercase tracking-label text-ink-900/45 mb-2">{t('legal.read_also')}</span>
                  <span className="font-display text-2xl md:text-3xl font-medium">{t(other.labelKey)}</span>
                </span>
                <ArrowUpRight size={28} className="shrink-0 text-ink-900/40 group-hover:text-accent-deep group-hover:-translate-y-1 group-hover:translate-x-1 transition-all" />
              </Link>
            )}
          </article>
        </div>
      </main>

      <div className="print:hidden"><Footer /></div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label={t('legal.back_top')}
        className={`fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-ink-900 text-ivory border border-ivory/15 flex items-center justify-center shadow-lg transition-all duration-300 hover:bg-accent-deep print:hidden ${progress > 0.08 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <ArrowUp size={18} />
      </button>
    </div>
  );
}
