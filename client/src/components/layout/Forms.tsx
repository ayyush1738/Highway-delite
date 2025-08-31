import { useState, useEffect } from "react";
import InputField from "../ui/InputField";
import { useNavigate } from "react-router-dom";

export default function Forms() {
  const [signup, setSignup] = useState(true); // toggle between signup/signin
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    otp: "",
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

  // Request OTP
  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = signup
        ? "http://localhost:8000/api/auth/signup/send-otp"
        : "http://localhost:8000/api/auth/signin/send-otp"; // adjust backend endpoint for signin

      const body: any = { email: formData.email };
      if (signup) {
        body.name = formData.name;
        body.dob = formData.dob;
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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

  // Verify OTP / Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = signup
        ? "http://localhost:8000/api/auth/signup/verify-otp"
        : "http://localhost:8000/api/auth/signin/verify-otp"; // adjust backend endpoint for signin

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(signup ? "Signup successful!" : "Sign-in successful!", data);
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        const err = await res.json();
        console.error(signup ? "Signup failed:" : "Sign-in failed:", err.error);
      }
    } catch (err) {
      console.error("Error submitting form", err);
    }
  };

  // OTP timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="h-[80%] w-full flex justify-center items-center align-middle">
      <div className="w-[80%] h-[80%] p-12">
        <h2 className="text-black text-4xl font-bold mt-8 mb-4">
          {signup ? "Sign Up" : "Sign In"}
        </h2>
        <p className="text-gray-500">
          {signup ? "Sign up to enjoy the feature of HD" : "Sign in to access your account"}
        </p>
        <form
          onSubmit={showOtpField ? handleSubmit : handleGetOtp}
          className="w-[90%] h-[80%] mt-4 space-y-4"
        >
          {/* Show name and dob only for signup */}
          {signup && (
            <>
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
            </>
          )}

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
                <span className="font-semibold text-red-500">{formatTime(timer)}</span>
              </p>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md mt-4 cursor-pointer hover:bg-blue-600"
          >
            {showOtpField ? "Verify OTP" : "Get OTP"}
          </button>

          <div className="flex flex-row justify-center items-center">
            {signup ? (
              <>
                <p className="text-gray-600">Already have an account?</p>
                <div
                  className="text-blue-500 underline ml-2 cursor-pointer"
                  onClick={() => {
                    setSignup(false);
                    setShowOtpField(false);
                  }}
                >
                  Sign in
                </div>
              </>
            ) : (
              <>
                <p className="text-gray-600">Don't have an account?</p>
                <div
                  className="text-blue-500 underline ml-2 cursor-pointer"
                  onClick={() => {
                    setSignup(true);
                    setShowOtpField(false);
                  }}
                >
                  Sign up
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
