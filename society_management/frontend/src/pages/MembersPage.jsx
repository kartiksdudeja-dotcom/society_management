import React, { useEffect, useState } from "react";
import API from "../services/api";
import { FaTrash, FaEdit, FaSave } from "react-icons/fa";

export default function MembersPage() {

  const [members, setMembers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  // Load members on page load
  useEffect(() => {
    API.get("/admin/members")
      .then((res) => setMembers(res.data))
      .catch((err) => console.log("Error loading members:", err));
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/delete-user/${id}`);
      setMembers(members.filter((m) => m._id !== id));
      alert("User deleted successfully");
    } catch (err) {
      alert("Delete failed");
    }
  };

  // Save edited user
 const handleSave = async () => {
  console.log("Saving user:", editData); // DEBUG

  try {
    const res = await API.put(`/admin/update-user/${editId}`, editData);
    alert("User updated successfully");

    setMembers(members.map((m) => (m._id === editId ? editData : m)));

    setEditId(null);
    setEditData({});
  } catch (err) {
    console.log("Update error:", err); // DEBUG
    alert("Update failed");
  }
};


  return (
    <div style={{ padding: 20 }}>
      <h2>Members List</h2>

      <table border="1" cellPadding="10" style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#eee" }}>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Flat Number</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {members.map((m, i) => (
            <tr key={m._id}>
              <td>{i + 1}</td>

              {/* Name */}
              <td>
                {editId === m._id ? (
                  <input
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                ) : (
                  m.name
                )}
              </td>

              {/* Email */}
              <td>
                {editId === m._id ? (
                  <input
                    value={editData.email}
                    onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  />
                ) : (
                  m.email
                )}
              </td>

              {/* Flat Number */}
              <td>
                {editId === m._id ? (
                  <input
                    value={editData.flatNumber}
                    onChange={(e) => setEditData({ ...editData, flatNumber: e.target.value })}
                  />
                ) : (
                  m.flatNumber
                )}
              </td>

              {/* Role */}
              <td>{m.role}</td>

              {/* Actions */}
              <td style={{ display: "flex", gap: "10px" }}>
                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(m._id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "red",
                    fontSize: "18px",
                  }}
                >
                  <FaTrash />
                </button>

                {/* Edit / Save Button */}
                {editId === m._id ? (
                  <button
                    onClick={handleSave}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "green",
                      fontSize: "18px",
                    }}
                  >
                    <FaSave />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(m._id);
                      setEditData(m);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "blue",
                      fontSize: "18px",
                    }}
                  >
                    <FaEdit />
                  </button>
                )}
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
