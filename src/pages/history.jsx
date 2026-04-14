import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header1 from "../components/Header1";
import Footer from "../components/Footer";
import { fetchUserHistory } from "../utils/mediaApi";
import img2 from "../assets/images/happy-face.png";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso) {
  if (!iso) return "Unknown date";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

/**
 * Group operations by calendar day (based on created_at).
 * Returns an array of { dateLabel, ops } sorted newest first.
 */
function groupByDay(ops) {
  const map = new Map();
  for (const op of ops) {
    const d = op.created_at ? new Date(op.created_at) : new Date(0);
    // Use ISO date string (YYYY-MM-DD) as key
    const key = d.toISOString().slice(0, 10);
    if (!map.has(key)) map.set(key, { date: d, dateLabel: formatDate(op.created_at), ops: [] });
    map.get(key).ops.push(op);
  }
  // Sort groups newest first
  return [...map.values()].sort((a, b) => b.date - a.date);
}

// ─── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ op }) {
  const meta = op?.metadata || {};
  const isComplete =
    meta?.video_status === 3 ||
    meta?.is_ready === true ||
    /completed/i.test(meta?.status_text || op?.status_text || "");
  const isFailed = /fail|error/i.test(meta?.status_text || op?.status_text || "");
  const label = meta?.status_text || op?.status_text || (isComplete ? "completed" : "processing");

  const cls = isFailed
    ? "text-red-400 border-red-500/30 bg-red-500/10"
    : isComplete
    ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
    : "text-amber-400 border-amber-500/30 bg-amber-500/10";

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  );
}

// ─── Single operation card ─────────────────────────────────────────────────────

function OpCard({ op }) {
  const meta = op?.metadata || {};
  const url = meta?.url || meta?.image_url || meta?.video_url || "";
  const thumb = meta?.thumbnail_url || meta?.image_url || "";
  const mediaKind = meta?.media_kind || op?.operation_type || "asset";

  return (
    <div className="flex gap-4 items-start bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-neutral-700 transition-colors">
      {/* Thumbnail */}
      <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950 flex items-center justify-center">
        {thumb ? (
          <img src={thumb} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-600 text-xs">N/A</span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-white text-sm truncate">
            {op?.title || "Generated asset"}
          </span>
          <StatusBadge op={op} />
          <span className="text-xs text-gray-500 ml-auto shrink-0">
            {formatTime(op?.created_at)}
          </span>
        </div>
        {op?.description && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{op.description}</p>
        )}
        <span className="inline-block mt-1 text-xs text-gray-500 bg-neutral-800 px-2 py-0.5 rounded-full">
          {mediaKind}
        </span>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex flex-col gap-1.5">
        {url ? (
          <>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-center border border-neutral-700 rounded-md px-3 py-1 text-xs text-white hover:bg-neutral-800 transition-colors whitespace-nowrap"
            >
              View
            </a>
            <a
              href={url}
              download
              className="text-center border border-neutral-700 rounded-md px-3 py-1 text-xs text-white hover:bg-neutral-800 transition-colors whitespace-nowrap"
            >
              Download
            </a>
          </>
        ) : (
          <span className="text-xs text-gray-600">—</span>
        )}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

const History = () => {
  const [user, setUser] = useState(null);
  const [ops, setOps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [limit] = useState(50);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch {}
    }
  }, []);

  const loadHistory = async (nextOffset = 0) => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setError("");
      const data = await fetchUserHistory({ user_id: user.id, limit, offset: nextOffset });
      const incoming = data?.operations || [];
      setOps((prev) => nextOffset === 0 ? incoming : [...prev, ...incoming]);
      setTotal(data?.total_count || 0);
      setOffset(nextOffset);
    } catch {
      setError("Failed to load history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) loadHistory(0);
  }, [user]);

  // Group ops into day sessions
  const sessions = useMemo(() => groupByDay(ops), [ops]);

  const canLoadMore = ops.length < total;

  return (
    <>
      <Header1 />

      <main className="min-h-screen text-white" style={{ background: "linear-gradient(to bottom, #0f0c29, #302b63, #24243e)" }}>
        <section className="py-24">
          <div className="container mx-auto px-4 max-w-3xl mt-4">

            {/* Greeting */}
            <div className="mb-8">
              <h4 className="text-base text-gray-400">Hello,</h4>
              <h2 className="text-3xl font-semibold flex items-center gap-3 text-white">
                {user?.full_name || user?.name || "Guest"}
                <img src={img2} alt="wave" className="w-10" />
              </h2>
              <p className="text-gray-400 mt-1 text-sm">
                Your activity history, grouped by session day.
              </p>
            </div>

            {error && (
              <div className="text-red-400 text-sm mb-4 border border-red-500/30 bg-red-500/10 rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Loading skeleton */}
            {loading && ops.length === 0 && (
              <div className="flex flex-col gap-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-20 rounded-xl bg-neutral-800/60 animate-pulse" />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && ops.length === 0 && !error && (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg font-medium mb-2">No history yet</p>
                <p className="text-sm mb-6">Create your first avatar to get started.</p>
                <Link
                  to="/landing"
                  className="inline-block border border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Create an Avatar
                </Link>
              </div>
            )}

            {/* Grouped sessions */}
            {sessions.map((session) => (
              <div key={session.dateLabel} className="mb-8">
                {/* Session header */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest whitespace-nowrap">
                    {session.dateLabel}
                  </span>
                  <div className="flex-1 h-px bg-neutral-800" />
                  <span className="text-xs text-gray-600 whitespace-nowrap">
                    {session.ops.length} item{session.ops.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Operations in this session */}
                <div className="flex flex-col gap-3">
                  {session.ops.map((op) => (
                    <OpCard key={op.id} op={op} />
                  ))}
                </div>
              </div>
            ))}

            {/* Footer actions */}
            {ops.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => loadHistory(0)}
                  disabled={loading}
                  className="border border-neutral-700 px-4 py-2 rounded-md text-sm text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                >
                  Refresh
                </button>
                {canLoadMore && (
                  <button
                    onClick={() => loadHistory(offset + limit)}
                    disabled={loading}
                    className="border border-neutral-700 px-4 py-2 rounded-md text-sm text-white hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                  >
                    {loading ? "Loading…" : "Load more"}
                  </button>
                )}
                <Link
                  to="/landing"
                  className="border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Create New Avatar
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default History;
