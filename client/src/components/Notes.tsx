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
            fetchNotes();
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
        <div className="min-h-screen p-2">
            {/* Header */}
            {/* Header */}
            <div className="p-4 w-full flex flex-row justify-between items-center">
                <section className="flex flex-row items-center">
                    <img src="/icon.png" alt="" className="w-6 h-6 md:w-10 md:h-10" />
                    <h1 className="text-black ml-4 text-xl sm:text-2xl md:text-3xl">
                        Dashboard
                    </h1>
                </section>
                <div
                    onClick={signout}
                    className="text-blue-500 underline text-base sm:text-lg md:text-2xl cursor-pointer"
                >
                    Sign Out
                </div>
            </div>


            {/* User Info */}
            <div className="w-full sm:w-[80%] py-12 mx-auto mt-6 rounded-2xl shadow-2xl border-2 p-6 border-gray-200">
                <h1 className="text-black text-2xl sm:text-4xl font-bold">
                    Welcome, {name}
                </h1>
                <h2 className="text-black text-sm sm:text-2xl mt-14 mb-4 break-words">
                    Email: {email}
                </h2>            </div>

            <div className="w-full sm:w-[80%] mx-auto flex flex-col p-4 justify-center items-center">
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-[50%] h-14 sm:h-20 bg-blue-500 text-white py-2 rounded-2xl mt-4 cursor-pointer hover:bg-blue-600"
                >
                    Create Note
                </button>
                <h1 className="text-black text-xl sm:text-2xl font-bold text-left w-full mt-12">
                    Notes
                </h1>
                <div className="w-full sm:w-[50%] mt-6">
                    {notes.length > 0 ? (
                        notes.map((note) => (
                            <div
                                key={note.id}
                                className="p-4 mb-2 border text-black rounded-lg shadow hover:bg-gray-100 flex justify-between items-center"
                            >
                                <span className="truncate">{note.title}</span>
                                <div
                                    className="text-red-500 cursor-pointer ml-2"
                                    onClick={() => deleteNote(note.id)}
                                >
                                    <img src="/del.png" alt="delete" className="w-6 h-6" />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center mt-4">No notes yet.</p>
                    )}
                </div>
            </div>


            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-2">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-full sm:w-[400px]">
                        <h2 className="text-lg sm:text-xl font-bold mb-4">Create Note</h2>
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
                        <div className="flex flex-col sm:flex-row justify-between gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={createNote}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg w-full sm:w-auto"
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
