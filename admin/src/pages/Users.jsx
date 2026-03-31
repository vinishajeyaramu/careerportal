import { useEffect, useRef, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { Edit, Trash2 } from "lucide-react";
import { Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const usersUrl = import.meta.env.VITE_USERS_URL;
const registerUrl = import.meta.env.VITE_REGISTER_URL;

const AddUsers = ({ onClose, onSubmit, editData }) => {
  const [userName, setUserName] = useState(editData ? editData.username : "");
  const [userEmail, setUserEmail] = useState(editData ? editData.email : "");
  const [userCredit, setUserCredit] = useState(
    editData ? editData.password : ""
  );
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!userName.trim()) newErrors.userName = "Name is required";
    if (!userEmail.trim()) {
      newErrors.userEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(userEmail)) {
      newErrors.userEmail = "Email is invalid";
    }
    if (!userCredit.trim()) {
      newErrors.userCredit = "Password is required";
    } else if (userCredit.length < 6) {
      newErrors.userCredit = "Password must be at least 6 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editData) {
      axios
        .put(`${usersUrl}/${editData.id}`, {
          username: userName,
          password: userCredit,
          email: userEmail,
        })
        .then((res) => {
          onSubmit(res.data, "update");
          toast.success("User updated successfully!");
        })
        .catch((err) => console.log("Error updating user:", err));
    } else {
      axios
        .post(registerUrl, {
          username: userName,
          password: userCredit,
          email: userEmail,
        })
        .then((res) => {
          onSubmit(res.data, "add");
          setUserName("");
          setUserCredit("");
          setUserEmail("");
          setErrors({});
          toast.success("User added successfully!");
        })
        .catch((err) => console.log("Error adding user:", err));
    }
  };

  return (
    <div className="admin-card max-w-lg rounded-[28px] p-6 mx-auto">
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-lg font-semibold text-gray-700">
          {editData ? "Edit User" : "Add User"}{" "}
          <span className="text-red-500">*</span>
        </label>
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="admin-input mb-4"
        />
        {errors.userName && (
          <p className="text-red-500 text-sm">{errors.userName}</p>
        )}
        <input
          type="email"
          placeholder="Enter Email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="admin-input mb-4"
        />
        {errors.userEmail && (
          <p className="text-red-500 text-sm">{errors.userEmail}</p>
        )}
        <input
          type="password"
          placeholder="Enter Password"
          value={userCredit}
          onChange={(e) => setUserCredit(e.target.value)}
          className="admin-input mb-4"
        />
        {errors.userCredit && (
          <p className="text-red-500 text-sm">{errors.userCredit}</p>
        )}
        <div className="flex flex-wrap gap-3 justify-end">
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

const Users = () => {
  const [users, setUsers] = useState([]);
  const [userForm, setUserForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios
      .get(usersUrl)
      // user data is available only after refreshing the page
      .then((response) => {
        setUsers(response.data);
      })
      .catch((err) => console.error("Error fetching users:", err));
  };
  
    

  const handleFormSubmit = (updatedUser, action) => {
    if (action === "add") {
      setUsers((prevUsers) => [...prevUsers, updatedUser]);
    } else if (action === "update") {
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      );
    }
    setUserForm(false);
    setEditData(null);
  };

  const handleEdit = (user) => {
    setEditData(user);
    setUserForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      axios
        .delete(`${usersUrl}/${id}`)
        .then(() => {
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
          toast.success("User deleted successfully!");
        })
        .catch((err) => console.error("Error deleting user:", err));
    }
  };

  const togglePasswordVisibility = (userId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  return (
    <main className="space-y-6">
      <ToastContainer />
      <div className="admin-panel rounded-[32px] p-6">
        <div className="flex flex-col gap-4 border-b border-[var(--admin-line)] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--admin-ink)]">Users</h1>
            <p className="mt-2 text-sm text-[var(--admin-muted)]">Manage admin access and credential visibility more clearly.</p>
          </div>
          <button
            onClick={() => {
              setEditData(null);
              setUserForm(true);
            }}
            className="admin-btn admin-btn-primary"
          >
            + Add User
          </button>
        </div>

        {userForm && (
          <AddUsers
            onClose={() => setUserForm(false)}
            onSubmit={handleFormSubmit}
            editData={editData}
          />
        )}

        <div className="admin-table-wrap mt-6 overflow-x-auto">
          <table className="w-full min-w-full border-collapse">
            <thead className="bg-[#f7f2eb]">
              <tr className="text-sm font-semibold text-gray-700">
                <th className="py-3 px-4 border text-start">S.No</th>
                <th className="py-3 px-4 border text-start">User Name</th>
                <th className="py-3 px-4 border text-start">User Email</th>
                <th className="py-3 px-4 border text-start">Password</th>
                <th className="py-3 px-4 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4 flex items-center space-x-2">
                      <span className="text-wrap overflow-hidden w-20">
                        {visiblePasswords[user.id]
                          ? user.password
                          : "•".repeat(8)}
                      </span>
                      <button onClick={() => togglePasswordVisibility(user.id)} className="admin-icon-btn ml-2 text-[var(--admin-accent)]">
                        {visiblePasswords[user.id] ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </td>
                    <td className="py-1 px-1 text-center">
                      {/* <button
                        onClick={() => handleEdit(user)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit size={20} />
                      </button> */}
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="admin-icon-btn text-[var(--admin-danger)]"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No users available.
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

AddUsers.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editData: PropTypes.object,
};

export default Users;
