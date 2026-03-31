import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Search } from "lucide-react";
import DataTable from "react-data-table-component";
import ViewCandidate from "../components/ViewCandidate";

const candidatesUrl = import.meta.env.VITE_CANDIDATES_URL;

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [viewId, setViewId] = useState();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchCandidates = async () => {
      const response = await axios.get(candidatesUrl);
      setCandidates(response.data);
    };

    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter((candidate) => {
    return (
      candidate?.first_name.toLowerCase().includes(query.toLowerCase()) ||
      candidate?.last_name.toLowerCase().includes(query.toLowerCase()) ||
      candidate?.email.toLowerCase().includes(query.toLowerCase()) ||
      candidate?.job_title.toLowerCase().includes(query.toLowerCase())
    );
  });

  const columns = [
    {
      name: "Job Applied",
      selector: (row) => row.job_title,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <button className="admin-icon-btn text-[var(--admin-accent)]" onClick={() => setViewId(row.id)}>
          <Eye size={18} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  if (viewId) {
    return <ViewCandidate id={viewId} setViewId={setViewId} />;
  }

  return (
    <div className="space-y-6">
      <section className="admin-panel rounded-[32px] p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Candidates</h1>
            <p className="mt-2 text-sm text-[var(--admin-muted)]">
              Review candidate records with clearer actions and search.
            </p>
          </div>
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]" size={18} />
            <input
              type="text"
              placeholder="Search by candidate, role, or email"
              className="admin-input pl-11"
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="admin-table-wrap">
        <DataTable
          columns={columns}
          data={filteredCandidates}
          pagination
          paginationPerPage={10}
          highlightOnHover
          pointerOnHover
          responsive
          customStyles={{
            headCells: {
              style: {
                fontWeight: "700",
                fontSize: "14px",
                backgroundColor: "#f7f2eb",
              },
            },
            cells: {
              style: {
                fontSize: "14px",
                color: "#1f1a17",
              },
            },
          }}
        />
      </div>
    </div>
  );
}
