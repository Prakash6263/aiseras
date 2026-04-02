// "use client";

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import Header1 from "../components/Header1";
// import Footer from "../components/Footer";
// import { fetchUserHistory } from "../utils/mediaApi";
// import img2 from "../assets/images/happy-face.png";

// const History = () => {
//   const [user, setUser] = useState(null);
//   const [ops, setOps] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [total, setTotal] = useState(0);
//   const [limit] = useState(50);
//   const [offset, setOffset] = useState(0);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) setUser(JSON.parse(storedUser));
//   }, []);

//   const loadHistory = async (nextOffset = 0) => {
//     if (!user?.id) return;

//     try {
//       setLoading(true);
//       setError("");

//       const data = await fetchUserHistory({
//         user_id: user.id,
//         limit,
//         offset: nextOffset,
//       });

//       setOps(
//         nextOffset === 0
//           ? data?.operations || []
//           : (prev) => [...prev, ...(data?.operations || [])]
//       );

//       setTotal(data?.total_count || 0);
//       setOffset(nextOffset);
//     } catch {
//       setError("Failed to load history. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user?.id) loadHistory(0);
//   }, [user]);

//   const canLoadMore = ops.length < total;

//   return (
//     <>
//       <Header1 />

//       <main className="text-white">
//         <section className="py-5">
//           <div className="container mt-4">

//             {/* Greeting */}
//             <div className="mb-4">
//               <h5 className="text-white">Hello,</h5>
//               <h2 className="fw-semibold d-flex align-items-center gap-3 text-white">
//                 {user?.full_name || "Guest"}
//                 <img src={img2} alt="hello" width={40} />
//               </h2>
//               <p className="text-white">
//                 Here are your generated assets. View or download them anytime.
//               </p>
//             </div>

//             {error && <div className="text-danger mb-3">{error}</div>}

//             {/* Table */}
//             <div className="table-responsive">
//               <table className="table  table-borderless align-middle mb-0">
//                 <thead className="border-bottom border-secondary">
//                   <tr className="text-white">
//                     <th>Preview</th>
//                     <th>Title</th>
//                     <th>Type</th>
//                     <th>Status</th>
//                     <th>Created</th>
//                     <th className="text-center">Action</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {loading && ops.length === 0 ? (
//                     <tr>
//                       <td colSpan="6" className="text-white py-4">
//                         Loading...
//                       </td>
//                     </tr>
//                   ) : ops.length === 0 ? (
//                     <tr>
//                       <td colSpan="6" className="text-white py-4">
//                         No items found.
//                       </td>
//                     </tr>
//                   ) : (
//                     ops.map((op) => {
//                       const meta = op?.metadata || {};
//                       const url = meta?.url || meta?.image_url || "";
//                       const thumb =
//                         meta?.thumbnail_url || meta?.image_url || "";

//                       const isComplete =
//                         meta?.video_status === 3 ||
//                         meta?.is_ready === true ||
//                         /completed/i.test(
//                           meta?.status_text || op?.status_text || ""
//                         );

//                       const statusText =
//                         meta?.status_text ||
//                         op?.status_text ||
//                         (isComplete ? "completed" : "processing");

//                       return (
//                         <tr key={op.id} className="border-bottom border-secondary">
//                           {/* Preview */}
//                           <td>
//                             {thumb ? (
//                               <img
//                                 src={thumb}
//                                 alt="thumb"
//                                 width={72}
//                                 height={72}
//                                 className="rounded border border-secondary object-fit-cover"
//                               />
//                             ) : (
//                               <div
//                                 className="d-flex align-items-center justify-content-center rounded border border-secondary text-white"
//                                 style={{ width: 72, height: 72 }}
//                               >
//                                 N/A
//                               </div>
//                             )}
//                           </td>

//                           {/* Title */}
//                           <td>
//                             <div className="fw-semibold text-white">
//                               {op?.title || "Generated"}
//                             </div>
//                             <div className="small text-white">
//                               {op?.description}
//                             </div>
//                           </td>

//                           {/* Type */}
//                           <td className="text-white">
//                             {meta?.media_kind || "-"}
//                           </td>

//                           {/* Status (keep colored) */}
//                           <td>
//                             <span
//                               className={`badge rounded-pill px-3 py-2 ${
//                                 /fail|error/i.test(statusText)
//                                   ? "bg-danger-subtle text-danger border border-danger"
//                                   : isComplete
//                                   ? "bg-success-subtle text-success border border-success"
//                                   : "bg-warning-subtle text-warning border border-warning"
//                               }`}
//                             >
//                               {statusText}
//                             </span>
//                           </td>

//                           {/* Created */}
//                           <td className="text-white">
//                             {op?.created_at
//                               ? new Date(op.created_at).toLocaleString()
//                               : "-"}
//                           </td>

//                           {/* Action */}
//                           <td>
//                             <div
//                               className="d-flex flex-column align-items-center justify-content-center gap-2"
//                               style={{ minHeight: 72 }}
//                             >
//                               <a
//                                 href={url || "#"}
//                                 target="_blank"
//                                 rel="noreferrer"
//                                 className="btn btn-outline-light btn-sm w-100"
//                                 style={{ maxWidth: 120 }}
//                               >
//                                 View
//                               </a>
//                               <a
//                                 href={url || "#"}
//                                 download
//                                 className="btn btn-outline-light btn-sm w-100"
//                                 style={{ maxWidth: 120 }}
//                               >
//                                 Download
//                               </a>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Footer actions */}
//             {ops.length > 0 && (
//               <div className="mt-4 d-flex flex-wrap gap-3">
//                 <button
//                   onClick={() => loadHistory(0)}
//                   disabled={loading}
//                   className="btn btn-outline-light"
//                 >
//                   Refresh
//                 </button>

//                 {canLoadMore && (
//                   <button
//                     onClick={() => loadHistory(offset + limit)}
//                     disabled={loading}
//                     className="btn btn-outline-light"
//                   >
//                     Load more
//                   </button>
//                 )}

//                 <Link
//                   to="/face-recognition"
//                   className="btn btn-outline-light"
//                 >
//                   Let’s Create One
//                 </Link>
//               </div>
//             )}
//           </div>
//         </section>
//       </main>

//       <Footer />
//     </>
//   );
// };

// export default History;


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header1 from "../components/Header1";
import Footer from "../components/Footer";
import { fetchUserHistory } from "../utils/mediaApi";
import img2 from "../assets/images/happy-face.png";

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
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const loadHistory = async (nextOffset = 0) => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError("");

      const data = await fetchUserHistory({
        user_id: user.id,
        limit,
        offset: nextOffset,
      });

      setOps(nextOffset === 0 ? data?.operations || [] : prev => [...prev, ...(data?.operations || [])]);
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

  const canLoadMore = ops.length < total;

  return (
    <>
      <Header1 />

      <main className="text-white ">
        <section className="py-24">
          <div className="container mx-auto mt-4">
            {/* Greeting */}
            <div className="mb-4">
              <h4 className="text-lg text-white">Hello,</h4>
              <h2 className="text-3xl font-semibold flex items-center gap-3 text-white">
                {user?.full_name || "Guest"}
                <img src={img2} alt="hello" className="w-10" />
              </h2>
              <p className="text-gray-400 mt-1">
                Here are your generated assets. View or download them anytime.
              </p>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-gray-300 border-b border-neutral-800">
                    {["Preview", "Title", "Type", "Status", "Created", "Action"].map(h => (
                      <th key={h} className="p-4 text-left font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {loading && ops.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-gray-400">
                        Loading...
                      </td>
                    </tr>
                  ) : ops.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-gray-400">
                        No items found.
                      </td>
                    </tr>
                  ) : (
                    ops.map(op => {
                      const meta = op?.metadata || {};
                      const url = meta?.url || meta?.image_url || "";
                      const thumb = meta?.thumbnail_url || meta?.image_url || "";

                      const isComplete =
                        meta?.video_status === 3 ||
                        meta?.is_ready === true ||
                        /completed/i.test(meta?.status_text || op?.status_text || "");

                      const statusText =
                        meta?.status_text ||
                        op?.status_text ||
                        (isComplete ? "completed" : "processing");

                      return (
                        <tr
                          key={op.id}
                          className="border-b border-neutral-800 align-middle"
                        >
                          {/* Preview */}
                          <td className="p-4">
                            {thumb ? (
                              <img
                                src={thumb}
                                alt="thumb"
                                className="w-18 h-18 rounded-lg object-cover border border-neutral-800 bg-neutral-900"
                              />
                            ) : (
                              <div className="w-18 h-18 flex items-center justify-center rounded-lg border border-neutral-800 text-gray-400">
                                N/A
                              </div>
                            )}
                          </td>

                          {/* Title */}
                          <td className="p-4">
                            <div className="font-semibold">{op?.title || "Generated"}</div>
                            <div className="text-sm text-gray-400">{op?.description}</div>
                          </td>

                          {/* Type */}
                          <td className="p-4">{meta?.media_kind || "-"}</td>

                          {/* Status */}
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border
                                ${
                                  /fail|error/i.test(statusText)
                                    ? "text-red-400 border-red-500/30 bg-red-500/10"
                                    : isComplete
                                    ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                                    : "text-amber-400 border-amber-500/30 bg-amber-500/10"
                                }`}
                            >
                              {statusText}
                            </span>
                          </td>

                          {/* Created */}
                          <td className="p-4">
                            {op?.created_at
                              ? new Date(op.created_at).toLocaleString()
                              : "-"}
                          </td>

                          {/* Action */}
                          <td className="p-4">
                            <div className="flex flex-col items-center justify-center gap-2 min-h-18">
                              <a
                                href={url || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="w-28 text-center border border-neutral-700 rounded-md px-3 py-1.5 text-sm hover:bg-neutral-800"
                              >
                                View
                              </a>
                              <a
                                href={url || "#"}
                                download
                                className="w-28 text-center border border-neutral-700 rounded-md px-3 py-1.5 text-sm hover:bg-neutral-800"
                              >
                                Download
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer actions */}
            {ops.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => loadHistory(0)}
                  disabled={loading}
                  className="border border-neutral-700 px-4 py-2 rounded-md hover:bg-neutral-800"
                >
                  Refresh
                </button>

                {canLoadMore && (
                  <button
                    onClick={() => loadHistory(offset + limit)}
                    disabled={loading}
                    className="border border-neutral-700 px-4 py-2 rounded-md hover:bg-neutral-800"
                  >
                    Load more
                  </button>
                )}

                <Link
                  to="/face-recognition"
                  className="border border-neutral-700 px-4 py-2 rounded-md hover:bg-neutral-800"
                >
                  Let’s Create One
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
