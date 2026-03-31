import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { ThemeContext } from "../App";
import { useContext } from "react";
import AddJobPost from "../components/AddJobPost";
import axios from "axios";
import EditJobPost from "../components/EditJobPost";
import ViewJobPost from "../components/ViewJobPost";
import { Edit, Eye } from "lucide-react";
import CloseIcon from "@mui/icons-material/Close";
import Modal from "react-modal";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const candidatesUrl = import.meta.env.VITE_CANDIDATES_URL;
const jobUrl = import.meta.env.VITE_JOB_URL;
const uploadsUrl = import.meta.env.VITE_UPLOADS_URL;

Modal.setAppElement("#root");

function JobPost() {
  const customStyles = {
    header: {
      style: {
        minHeight: "56px",
        padding: "200px",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f0f0f0",
        fontSize: "14px",
        fontWeight: "bold",
      },
    },
  };
  const { job, setJob } = useContext(ThemeContext);
  const [view, setView] = useState(false);
  const [viewId, setViewId] = useState("");
  const [isAdd, setIsAdd] = useState(false);
  const [editId, setEditId] = useState("");
  const [isEdit, setIsEdit] = useState("");
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [open, setOpen] = useState(false);
  const [ok, setOk] = useState(false);
  const [id, setId] = useState();

  /////candidates

  const [viewCandidate, setViewCandidate] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [jobCandidates, setJobCandidates] = useState([]);
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const response = await axios.get(candidatesUrl);
    setCandidates(response.data);
  };

  /////candidates

  const columns = [
    {
      name: "Title",
      selector: (row) => row.job_title,
      sortable: true,
      width: "max",
    },
    {
      name: "Skills",
      selector: (row) => row.job_technical_skills.join(", "),
      sortable: true,
      width: "max",
    },
    {
      name: "Created By",
      selector: (row) => row.job_created_by,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.job_status,
      sortable: true,
    },
    {
      name: "Candidates",
      cell: (row) => (
        <button
          className="admin-btn admin-btn-secondary px-3 py-2 text-xs"
          onClick={() => handleViewCandidates(row.job_id)}
        >
          View Candidates
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-3">
          <button
            className="admin-icon-btn text-[var(--admin-success)]"
            onClick={() => handleEdit(row)}
          >
            <Edit size={15} />
          </button>
          <button
            className="admin-icon-btn text-[var(--admin-accent)]"
            onClick={() => handleView(row.job_id)}
          >
            <Eye size={15} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
    },
  ];

  useEffect(() => {
    axios.get(jobUrl).then((res) => {
      setJob(res.data);
    });
  }, [setJob]);

  const filteredItems = job.filter(
    (item) =>
      item.job_title &&
      item.job_title.toLowerCase().includes(filterText.toLowerCase())
  );
  const onFilter = (e) => setFilterText(e.target.value);
  const handleClear = () => {
    if (filterText) {
      setResetPaginationToggle(!resetPaginationToggle);
      setFilterText("");
    }
  };

  function handleOpen() {
    setIsAdd(true);
  }

  const handleView = (job_id) => {
    setView(true);
    setViewId(job_id);
  };

  const handleViewCandidates = (job_id) => {
    const jobCandidates = candidates.filter(
      (candidate) => candidate.job_id == job_id
    );
    setJobCandidates(jobCandidates);
    setViewCandidate(true);
  };

  const handleDelete = (job_id) => {
    setId(job_id);
    setOk(true);
  };

  const handleDeleteItem = (id) => {
    axios
      .delete(`${jobUrl}/${id}`)
      .then((response) => {
        if (response.status === 200) {
          const filteredItems = job.filter((item) => item.job_id !== id);
          setJob(filteredItems);
          toast.success("Job post deleted successfully!");
        }
      })
      .catch((error) => {
        console.error("There was an error deleting the product:", error);
      });
  };

  if (view)
    return (
      <ViewJobPost
        setOpen={setOpen}
        handleOpen={handleOpen}
        job={job}
        view={view}
        setView={setView}
        setJob={setJob}
        viewId={viewId}
        setViewId={setViewId}
      />
    );

  if (isAdd)
    return (
      <AddJobPost
        handleOpen={handleOpen}
        setOpen={setOpen}
        isAdd={isAdd}
        job={job}
        setJob={setJob}
        setIsAdd={setIsAdd}
        onSuccess={() => toast.success("Job post created successfully!")}
      />
    );

  const handleEdit = (row) => {
    setEditId(row.job_id);
    setIsEdit(true);
  };
  if (isEdit)
    return (
      <EditJobPost
        setOpen={setOpen}
        handleOpen={handleOpen}
        job={job}
        setJob={setJob}
        isEdit={isEdit}
        editId={editId}
        setIsEdit={setIsEdit}
        onSuccess={() => toast.success("Job post updated successfully!")}
      />
    );

  const candidateColumns = [
    {
      name: "First Name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.last_name,
      sortable: true,
    },
    {
      name: "LinkedIn",
      cell: (row) => (
        <a href={row.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
      ),
      sortable: false,
    },
    {
      name: "Website",
      cell: (row) => (
        <a href={row.website} target="_blank" rel="noopener noreferrer">
          Website
        </a>
      ),
      sortable: false,
    },
    {
      name: "Resume",
      cell: (row) => (
        <a
          className="admin-btn admin-btn-secondary px-3 py-2 text-xs"
          href={`${uploadsUrl}/${row.resume}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>
      ),
      sortable: false,
    },
    {
      name: "Cover Letter",
      cell: (row) => (
        <a
          className="admin-btn admin-btn-secondary px-3 py-2 text-xs"
          href={`${uploadsUrl}/${row.cover}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Cover Letter
        </a>
      ),
      sortable: false,
    },
  ];

  return (
    <div className="admin-page-shell space-y-6">
      <ToastContainer />
      <div className="admin-panel rounded-[32px] p-6">
        <div className="flex pt-2 flex-col h-auto w-full">
          <div className="flex flex-col gap-4 p-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold">Job Posts</h1>
              <p className="mt-2 text-sm text-[var(--admin-muted)]">
                Manage open roles, review records, and inspect candidate lists without losing action visibility.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex gap-2">
                <input
                  id="search"
                  type="text"
                  className="admin-input !w-56 !py-3"
                  placeholder="Filter By Name"
                  aria-label="Search Input"
                  value={filterText}
                  onChange={onFilter}
                />
                <button
                  className="admin-btn admin-btn-secondary min-w-[92px]"
                  type="button"
                  onClick={handleClear}
                >
                  Clear
                </button>
              </div>
              <button
                className="admin-btn admin-btn-primary min-h-[52px] min-w-[170px]"
                onClick={handleOpen}
              >
                Create JobPost
              </button>
            </div>
          </div>

          {ok && (
            <div className="z-50 absolute  h-full w-max flex  justify-center  pt-5 top-0 left-0">
              <div className="admin-card w-[400px] h-[220px] flex flex-col gap-5 items-center justify-center rounded-[28px] px-6 text-center">
                <h1>Are you sure you want to delete this product?</h1>
                <div className=" flex gap-4">
                  <button
                    onClick={() => {
                      handleDeleteItem(id);
                      setOk(false);
                    }}
                    className="admin-btn admin-btn-danger"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setOk(false)}
                    className="admin-btn admin-btn-secondary"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="admin-table-wrap mt-4">
            <DataTable
              columns={columns}
              data={filteredItems}
              pagination
              paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
              persistTableHead
              customStyles={customStyles}
            />
          </div>

          <Modal
            isOpen={viewCandidate}
            onRequestClose={() => setViewCandidate(false)}
            contentLabel="Candidates Modal"
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          >
            <div className="admin-panel w-full max-w-4xl rounded-[28px] p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Candidates</h2>
                <button
                  onClick={() => setViewCandidate(false)}
                  className="admin-icon-btn text-[var(--admin-muted)]"
                >
                  <CloseIcon />
                </button>
              </div>
              <hr />
              <div className="admin-table-wrap mt-4">
                <DataTable
                  columns={candidateColumns}
                  data={jobCandidates}
                  pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[10]}
                  customStyles={customStyles}
                />
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default JobPost;
