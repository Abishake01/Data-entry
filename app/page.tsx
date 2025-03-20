"use client";
import { useEffect, useState, FormEvent } from "react";
import { supabase } from "../lib/supabase";
import toast, { Toaster } from "react-hot-toast";

interface STUDENT {
  id?: string;
  name: string;
  email: string;
  phone_number: string;
  gender: string;
}

export default function Home() {
  const [students, setStudents] = useState<STUDENT[]>([]);
  const [form, setForm] = useState<STUDENT>({
    name: "",
    email: "",
    phone_number: "",
    gender: "Male",
  });
  const [editId, setEditId] = useState<string | null>(null);

  // Fetch students from Supabase
  async function fetchStudents() {
    const { data, error } = await supabase.from("STUDENT").select("*");
    if (error) {
      console.error("Error fetching students:", error);
    } else {
      setStudents(data || []);
    }
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle Form Submit (Insert or Update)
  async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (editId) {
      // Update student
      const { error } = await supabase
        .from("STUDENT")
        .update(form)
        .eq("id", editId);

      if (error) {
        toast.error(`Failed to update: ${error.message}`);
      } else {
        toast.success("Student updated successfully");
        setEditId(null);
      }
    } else {
      // Insert new student
      const { error } = await supabase.from("STUDENT").insert([form]);

      if (error) {
        toast.error(`Failed to create: ${error.message}`);
      } else {
        toast.success("Student added successfully");
      }
    }

    // Reset form and refresh list
    setForm({ name: "", email: "", phone_number: "", gender: "Male" });
    fetchStudents();
  }

  // Edit Student
  function handleEdit(student: STUDENT) {
    setForm(student);
    setEditId(student.id || null);
  }

  // Delete Student
  async function handleDelete(id: string) {
    const { error } = await supabase.from("STUDENT").delete().eq("id", id);
    if (error) {
      toast.error(`Failed to delete: ${error.message}`);
    } else {
      toast.success("Student deleted successfully");
      fetchStudents();
    }
  }

  return (
    <>
      <div className="container my-5">
        <Toaster />
        <h3 className="mb-4">Student Management</h3>
        <div className="row">
          {/* Left Side Form */}
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) =>
                        setForm({ ...form, name: event.target.value })
                      }
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        setForm({ ...form, email: event.target.value })
                      }
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      value={form.phone_number}
                      onChange={(event) =>
                        setForm({ ...form, phone_number: event.target.value })
                      }
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={form.gender}
                      onChange={(event) =>
                        setForm({ ...form, gender: event.target.value })
                      }
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <button className="btn btn-primary w-100">
                    {editId ? "Update" : "Add"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Side Table */}
          <div className="col-md-8">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone_number}</td>
                      <td>{student.gender}</td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(student.id!)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center">
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
