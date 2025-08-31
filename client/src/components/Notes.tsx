import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    fetch("http://localhost:8000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) navigate("/");
        else {
          setName(data.name || "");
          setEmail(data.email || "");
        }
      })
      .catch(() => navigate("/"));

    fetchNotes();
  }, [navigate]);

  const fetchNotes = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/notes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setNotes(data.notes);
  };

  // Signout
  const signout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Create Note
  const createNote = async () => {
    const token = localStorage.getItem("token");
    if (!title || !content) {
      alert("Please enter title and content");
      return;
    }
    const res = await fetch("http://localhost:8000/api/notes/create-notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    if (res.ok) {
      setShowModal(false);
      setTitle("");
      setContent("");
      fetchNotes(); // refresh notes list
    } else {
      alert(data.error || "Failed to create note");
    }
  };

  // Delete Note
  const deleteNote = async (id: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/notes/delete-notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ noteId: id }),
    });
    const data = await res.json();
    if (res.ok) fetchNotes();
    else alert(data.error || "Failed to delete note");
  };

  return (
    <div className="h-full w-full p-2">
      {/* Header */}
      <div className="p-4 w-full flex flex-row justify-between">
        <section className="p-6 flex flex-row w-auto">
          <img src="/icon.png" alt="" />
          <h1 className="text-black my-auto ml-4 text-3xl">Dashboard</h1>
        </section>
        <div
          onClick={signout}
          className="my-auto text-blue-500 underline text-2xl mr-20 cursor-pointer"
        >
          Sign Out
        </div>
      </div>

      {/* User Info */}
      <div className="w-[80%] h-[40%] mx-auto mt-10 rounded-2xl shadow-2xl border-2 p-8 border-gray-200">
        <h1 className="text-black text-6xl mt-8 pl-8">Welcome, {name}</h1>
        <h1 className="text-black text-3xl mt-8 pl-8">Email: {email}</h1>
      </div>

      {/* Create Note Button */}
      <div className="w-[80%] mx-auto flex flex-col p-4 justify-center items-center">
        <button
          onClick={() => setShowModal(true)}
          className="w-[50%] h-20 bg-blue-500 text-white py-2 rounded-2xl mt-4 cursor-pointer hover:bg-blue-600"
        >
          Create Note
        </button>

        {/* Notes List */}
        <div className="w-[50%] mt-6">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                className="p-4 mb-2 border text-black rounded-lg shadow hover:bg-gray-100 flex justify-between items-center"
              >
                <span>{note.title}</span>
                <div
                  className="text-red-500 cursor-pointer"
                  onClick={() => deleteNote(note.id)}
                >          <img src="/del.png" alt="" />
</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-4">No notes yet.</p>
          )}
        </div>
      </div>

      {/* Modal for Create Note */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[400px]">
            <h2 className="text-xl font-bold mb-4">Create Note</h2>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
              className="w-full p-2 border rounded-lg mb-3 text-black"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Note content"
              className="w-full p-2 border rounded-lg mb-3 text-black"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={createNote}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
