import { useEffect, useRef, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const locationUrl = import.meta.env.VITE_LOCATION_URL;

const AddLocation = ({ onClose, onSubmit, editData, existingLocations }) => {
  const [locationName, setLocationName] = useState(
    editData?.location_title || ""
  );
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!locationName.trim()) {
      newErrors.locationName = "Location name is required";
    } else if (
      existingLocations.some(
        (location) =>
          location.location_title.toLowerCase() === locationName.toLowerCase()
      )
    ) {
      newErrors.locationName = "Location name already exists";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = editData
        ? await axios.put(`${locationUrl}/${editData.location_id}`, {
            location_title: locationName,
          })
        : await axios.post(locationUrl, { location_title: locationName });

      onSubmit(response.data, editData ? "update" : "add");
      setLocationName("");
      onClose();
      toast.success(`Location ${editData ? "updated" : "added"} successfully!`);
    } catch (error) {
      console.error(
        Error `${editData ? "updating" : "adding"} location:`,
        error
      );
    }
  };

  return (
    <div className="admin-card rounded-[28px] p-6">
      <h2 className="text-lg font-semibold mb-4">
        {editData ? "Edit Location" : "Add Location"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter Location Name"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          className="admin-input"
        />
        {errors.locationName && (
          <p className="text-red-500 text-sm">{errors.locationName}</p>
        )}
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="admin-btn admin-btn-primary"
          >
            {editData ? "Update" : "Submit"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="admin-btn admin-btn-secondary"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

// PropTypes Validation
AddLocation.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editData: PropTypes.shape({
    location_id: PropTypes.number,
    location_title: PropTypes.string,
  }),
  existingLocations: PropTypes.arrayOf(
    PropTypes.shape({
      location_id: PropTypes.number,
      location_title: PropTypes.string,
    })
  ).isRequired,
};

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [locationForm, setLocationForm] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get(locationUrl);
      setLocations(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleFormSubmit = (updatedLocation, action) => {
    if (action === "add") {
      setLocations((prev) => [...prev, updatedLocation]);
    } else {
      setLocations((prev) =>
        prev.map((loc) =>
          loc.location_id === updatedLocation.location_id
            ? updatedLocation
            : loc
        )
      );
    }
    setLocationForm(false);
    setEditData(null);
  };

  const handleEdit = (location) => {
    setEditData(location);
    setLocationForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this location?")) {
      try {
        await axios.delete(`${locationUrl}/${id}`);
        setLocations((prev) => prev.filter((loc) => loc.location_id !== id));
        toast.success("Location deleted successfully!");
      } catch (error) {
        console.error("Error deleting location:", error);
      }
    }
  };

  return (
    <main className="space-y-6">
      <ToastContainer />
      <div className="admin-panel rounded-[32px] p-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--admin-ink)]">Locations</h1>
            <p className="mt-2 text-sm text-[var(--admin-muted)]">Maintain the list of places your team hires from.</p>
          </div>
          <button
            onClick={() => {
              setEditData(null);
              setLocationForm(true);
            }}
            className="admin-btn admin-btn-primary"
          >
            <Plus size={18} /> Add Location
          </button>
        </div>

        {/* Location Form */}
        {locationForm && (
          <AddLocation
            onClose={() => setLocationForm(false)}
            onSubmit={handleFormSubmit}
            editData={editData}
            existingLocations={locations}
          />
        )}

        {/* Locations Table */}
        <div className="admin-table-wrap mt-6 overflow-x-auto">
          <table className="w-full border-collapse bg-white">
            <thead className="bg-[#f7f2eb] text-gray-800">
              <tr className="text-left text-sm font-semibold">
                <th className="py-3 px-4 border">S.No</th>
                <th className="py-3 px-4 border">Location</th>
                <th className="py-3 px-4 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {locations.length > 0 ? (
                locations.map((location, index) => (
                  <tr
                    key={location.location_id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{location.location_title}</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center gap-3">
                      <button
                        onClick={() => handleEdit(location)}
                        className="admin-icon-btn text-[var(--admin-success)]"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(location.location_id)}
                        className="admin-icon-btn text-[var(--admin-danger)]"
                      >
                        <Trash2 size={20} />
                      </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No locations available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Location;
