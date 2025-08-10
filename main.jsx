import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ExternalLink, BookOpen, RefreshCw, Table as TableIcon, LayoutGrid } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// --- HOW TO USE ON GITHUB PAGES ---
// 1) Create a repo and enable GitHub Pages.
// 2) Put the generated JSON file (image_models_data.json) in your public/ folder (or the same folder as the built index.html) 
//    and make sure the fetch path below matches where you host it.
// 3) Ensure TailwindCSS is wired up in your build (or drop in your own CSS). If you prefer no Tailwind, replace the classNames with your styles.
// 4) Export this component as your app's default and render it in main.tsx/main.jsx.
// 5) If you use a subpath on Pages (e.g., /your-repo), keep fetch path relative ("./image_models_data.json").

// Fallback data in case fetch fails. You can delete this once hosting JSON works.
const FALLBACK_DATA = [] as any[];

function useImageModelsData() {
  const [data, setData] = useState<any[]>(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("./image_models_data.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
        const json = await res.json();
        setData(Array.isArray(json) ? json : []);
      } catch (e: any) {
        console.warn("Falling back to embedded data.", e);
        setError(e?.message ?? "Failed to load data");
        setData(FALLBACK_DATA);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { data, loading, error, reload: () => window.location.reload() };
}

function cleanText(v?: any) {
  return String(v ?? "").trim();
}

function splitBullets(s: string) {
  const txt = cleanText(s);
  if (!txt) return [] as string[];
  // split on common separators
  return txt
    .split(/\n|·|•|;|\||,|\u2022/g)
    .map((t) => t.trim())
    .filter(Boolean);
}

function characteristicCounts(data: any[]) {
  // chart: number of bullet points per tool
  return data.map((row) => ({
    tool: cleanText(row["Tool"]) || "(untitled)",
    items: splitBullets(row["Characteristics"]).length || (cleanText(row["Characteristics"]) ? 1 : 0),
  }));
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">{children}</span>;
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 shadow-sm p-5 bg-white hover:shadow-md transition-shadow">
      {children}
    </div>
  );
}

function ToolCard({ row }: { row: any }) {
  const tool = cleanText(row["Tool"]);
  const icon = cleanText(row["Platform Icon"]);
  const howTo = cleanText(row["How to page"]);
  const site = cleanText(row["Site link"]);
  const bullets = splitBullets(row["Characteristics"]);

  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <div className="flex items-start gap-4">
          {icon ? (
            <img src={icon} alt={`${tool} icon`} className="h-12 w-12 rounded-xl object-cover border border-slate-200" />
          ) : (
            <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
              <span className="text-slate-500 text-sm">{tool?.slice(0, 1) || "?"}</span>
            </div>
          )}

          <div className="flex-1">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 className="text-lg font-semibold text-slate-900">{tool || "Untitled Tool"}</h3>
              <div className="flex gap-2">
                {howTo && (
                  <a className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50" href={howTo} target="_blank" rel="noreferrer">
                    <BookOpen size={16} /> How‑to
                  </a>
                )}
                {site && (
                  <a className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50" href={site} target="_blank" rel="noreferrer">
                    <ExternalLink size={16} /> Site
                  </a>
                )}
              </div>
            </div>

            {bullets.length > 0 ? (
              <ul className="mt-3 grid gap-1">
                {bullets.map((b, i) => (
                  <li key={i} className="text-sm text-slate-700">• {b}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-slate-600">No characteristics provided.</p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function ToolsTable({ rows }: { rows: any[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="min-w-full bg-white">
        <thead className="bg-slate-50 text-left text-slate-700">
          <tr>
            <th className="px-4 py-3 text-sm font-medium">Tool</th>
            <th className="px-4 py-3 text-sm font-medium">Characteristics</th>
            <th className="px-4 py-3 text-sm font-medium">How to</th>
            <th className="px-4 py-3 text-sm font-medium">Site</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-t border-slate-100">
              <td className="px-4 py-3 text-slate-900 whitespace-nowrap">{cleanText(row["Tool"])}</td>
              <td className="px-4 py-3 text-slate-700">
                {splitBullets(row["Characteristics"]).length > 0 ? (
                  <ul className="list-disc list-inside">
                    {splitBullets(row["Characteristics"]).map((b, i) => (
                      <li key={i} className="text-sm">{b}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-sm">{cleanText(row["Characteristics"]) || "—"}</span>
                )}
              </td>
              <td className="px-4 py-3 text-sm"><a className="text-blue-600 hover:underline" href={cleanText(row["How to page"]) || undefined} target="_blank" rel="noreferrer">{cleanText(row["How to page"]) ? "Open" : "—"}</a></td>
              <td className="px-4 py-3 text-sm"><a className="text-blue-600 hover:underline" href={cleanText(row["Site link"]) || undefined} target="_blank" rel="noreferrer">{cleanText(row["Site link"]) ? "Open" : "—"}</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Dashboard() {
  const { data, loading, error, reload } = useImageModelsData();

  const [query, setQuery] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) => {
      const tool = cleanText(row["Tool"]).toLowerCase();
      const chars = cleanText(row["Characteristics"]).toLowerCase();
      return tool.includes(q) || chars.includes(q);
    });
  }, [data, query]);

  const chartData = useMemo(() => characteristicCounts(filtered), [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900 text-white grid place-items-center font-bold">IM</div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">Image Models Dashboard</h1>
              <p className="text-xs text-slate-600">Clean view of your uploaded spreadsheet</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setView(view === "cards" ? "table" : "cards")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
              {view === "cards" ? <><TableIcon size={16}/> Table</> : <><LayoutGrid size={16}/> Cards</>}
            </button>
            <button onClick={reload} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
              <RefreshCw size={16}/> Reload
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <Badge>{filtered.length} tools</Badge>
              {query && <Badge>filtered</Badge>}
              {error && <Badge>offline mode</Badge>}
            </div>

            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tools & characteristics..."
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>
        </section>

        <section className="mb-8">
          <Card>
            <h2 className="text-base font-semibold text-slate-900">Characteristics per tool</h2>
            <p className="text-sm text-slate-600 mb-4">Counts the bullet-like items found in each tool's “Characteristics”.</p>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tool" interval={0} angle={-10} textAnchor="end" height={50} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="items" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>

        {loading ? (
          <p className="text-slate-600">Loading data…</p>
        ) : filtered.length === 0 ? (
          <p className="text-slate-600">No results. Try a different search.</p>
        ) : view === "cards" ? (
          <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((row, i) => (
              <ToolCard key={i} row={row} />
            ))}
          </section>
        ) : (
          <section>
            <ToolsTable rows={filtered} />
          </section>
        )}

        <footer className="mt-10 text-xs text-slate-500">
          <p>
            Data source: <code>image_models_data.json</code>. Place this file alongside your built <code>index.html</code> (or in <code>public/</code> when using Vite/CRA) so the relative fetch path <code>./image_models_data.json</code> resolves on GitHub Pages.
          </p>
        </footer>
      </main>
    </div>
  );
}
