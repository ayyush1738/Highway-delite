import { useState, useEffect } from "react"
import InputField from "../ui/InputField";
import { useNavigate } from "react-router-dom";

export default function Forms() {
    const [signup, setSignup] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        dob: "",
        email: "",
        otp: ""
    });

    const [showOtpField, setShowOtpField] = useState(false);
    const [timer, setTimer] = useState(0);

    const navigate = useNavigate();


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleGetOtp = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8000/api/auth/signup/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: formData.email,
                    name: formData.name,   // only if backend still requires
                    dob: formData.dob      
                }),
            });

            if (!res.ok) {
                const err = await res.json();
                console.error("Error:", err.error);
                return;
            }

            console.log("OTP sent to:", formData.email);
            setShowOtpField(true);
            setTimer(300);
        } catch (err) {
            console.error("Failed to send OTP", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:8000/api/auth/signup/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                console.log("Signup successful!", data);
                localStorage.setItem("token", data.token);

                navigate("/dashboard");
            } else {
                const err = await res.json();
                console.error("Signup failed:", err.error);
            }
        } catch (err) {
            console.error("Error submitting form", err);
        }
    };

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };


    return (
        <div className="h-[80%] w-full flex justify-center items-center align-middle">
            {signup ? (
                <div className="w-[80%] h-[80%] p-12">
                    <h2 className="text-black text-4xl font-bold mt-8 mb-4">Sign up</h2>
                    <p className="text-gray-500">Sign up to enjoy the feature of HD</p>
                    <form
                        onSubmit={showOtpField ? handleSubmit : handleGetOtp}
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
                                    className="h-5 w-5 cursor-pointer"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    onClick={() => {
                                        const input = document.getElementById("dob") as HTMLInputElement | null;
                                        input?.showPicker?.();
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

                        <InputField
                            id="email"
                            label="Your Email"
                            type="email"
                            placeholder="youremail@xyz"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        {showOtpField && (
                            <div className="space-y-2">
                                <InputField
                                    id="otp"
                                    label="Enter OTP"
                                    type="text"
                                    placeholder="Enter the 6-digit OTP"
                                    value={formData.otp}
                                    onChange={handleChange}
                                />
                                <p className="text-sm text-gray-500">
                                    Time left:{" "}
                                    <span className="font-semibold text-red-500">
                                        {formatTime(timer)}
                                    </span>
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 cursor-pointer hover:bg-blue-600"
                        >
                            {showOtpField ? "Verify OTP" : "Get OTP"}
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