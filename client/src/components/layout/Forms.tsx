import { useState } from "react"
import InputField from "../ui/InputField";

export default function Forms() {
    const [signup, setSignup] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        email: "",
        otp: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Example API call
        const res = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            console.log("Signup successful!");
        } else {
            console.error("Signup failed");
        }
    };

    return (
        <div className="h-[80%] w-full flex justify-center items-center align-middle">
            {signup ? (
                <div className="w-[80%] h-[80%] p-12">
                    <h2 className="text-black text-4xl font-bold mt-8 mb-4">Sign up</h2>
                    <p className="text-gray-500">Sign up to enjoy the feature of HD</p>
                    <form
                        onSubmit={handleSubmit}
                        className="w-[90%] h-[80%] mt-4 space-y-4"
                    >

                        <InputField
                            id="name"
                            label="Your Name"
                            type="text"
                            placeholder="Please Enter Your Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {/* Date of Birth */}
                        <InputField
                            id="dob"
                            label="Date of Birth"
                            type="date"
                            placeholder="11 December 1997"
                            value={formData.dob}
                            onChange={handleChange}
                            icon={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
onClick={() => {
        const input = document.getElementById("dob") as HTMLInputElement | null;
        input?.showPicker?.(); // 👈 opens native date picker
      }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            }
                        />

                        {/* Email */}
                        

                        {/* Password */}
                        <InputField
                            id="email"
                            label="Your Email"
                            type="email"
                            placeholder="youremail@xyz"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
                        >
                            Sign up
                        </button>
                    </form>
                </div>
            ) : (
                <div>

                </div>
            )}
        </div>
    )
}