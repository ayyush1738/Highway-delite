import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token)
    if (!token) {
      navigate("/"); // redirect if not logged in
      return;
    }
    fetch("http://localhost:8000/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          navigate("/");
        } else {
          setName(data.name || "");
          setEmail(data.email || "");
        }
      })
      .catch(() => navigate("/"));
  }, [navigate]);

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
      alert("Note created!");
      setTitle("");
      setContent("");
    } else {
      alert(data.error || "Failed to create note");
    }
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

      {/* Create Note */}
      <div className="w-[80%] mx-auto flex flex-col p-4 justify-center items-center">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="w-[50%] p-2 border rounded-2xl mt-4"
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note content"
          className="w-[50%] p-2 border rounded-2xl mt-4"
        />
        <button
          onClick={createNote}
          className="w-[50%] h-20 bg-blue-500 text-white py-2 rounded-2xl mt-4 cursor-pointer hover:bg-blue-600"
        >
          Create Note
        </button>
      </div>
    </div>
  );
}
