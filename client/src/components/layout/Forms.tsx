import { useState, useEffect } from "react";
import InputField from "../ui/InputField";
import { useNavigate } from "react-router-dom";

interface SignUpForm {
  name: string;
  dob: string;
  email: string;
  otp: string;
}

interface SignInForm {
  email: string;
  otp: string;
}

export default function Forms() {
  const [signup, setSignup] = useState(true);
  const [formData, setFormData] = useState<SignUpForm | SignInForm>(
    signup
      ? { name: "", dob: "", email: "", otp: "" }
      : { email: "", otp: "" }
  );
  const [showOtpField, setShowOtpField] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value } as any);
  };

  // Request OTP
  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const url = signup
        ? "http://localhost:8000/api/auth/signup/send-otp"
        : "http://localhost:8000/api/auth/signin/send-otp";

      const body: any = { email: formData.email };
      if (signup) {
        const { name, dob } = formData as SignUpForm;
        body.name = name;
        body.dob = dob;
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        setLoading(false);
        return;
      }

      setShowOtpField(true);
      setTimer(300);
      setSuccess("OTP sent successfully! Check your email.");
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP / Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const url = signup
        ? "http://localhost:8000/api/auth/signup/verify-otp"
        : "http://localhost:8000/api/auth/signin/verify-otp";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.error || "Verification failed");
      }
    } catch (err) {
      console.error(err);
      setError("Error submitting form. Please try again.");
    } finally {
      setLoading(false);
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

  // Reset formData type when switching
  const handleSwitch = () => {
    setSignup(!signup);
    setShowOtpField(false);
    setError(null);
    setSuccess(null);
    setFormData(
      !signup
        ? { name: "", dob: "", email: "", otp: "" }
        : { email: "", otp: "" }
    );
  };

  return (
    <div className="h-[80%] w-full flex justify-center items-center">
      <div className="w-full h-full md:w-[80%] md:h-[80%] p-12 ">
        <h2 className="text-black text-2xl md:text-4xl font-bold mt-8 mb-4">
          {signup ? "Sign Up" : "Sign In"}
        </h2>
        <p className="text-gray-500 mb-4">
          {signup
            ? "Sign up to enjoy the feature of HD"
            : "Sign in to access your account"}
        </p>

        {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}
        {success && <p className="text-green-500 font-semibold mb-2">{success}</p>}

        <form
          onSubmit={showOtpField ? handleSubmit : handleGetOtp}
          className="w-[90%] h-[80%] mt-4 space-y-4"
        >
          {signup && (
            <>
              <InputField
                id="name"
                label="Your Name"
                type="text"
                placeholder="Please Enter Your Name"
                value={(formData as SignUpForm).name}
                onChange={handleChange}
              />
              <InputField
                id="dob"
                label="Date of Birth"
                type="date"
                value={(formData as SignUpForm).dob}
                onChange={handleChange}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 cursor-pointer"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    onClick={() => {
                      const input = document.getElementById(
                        "dob"
                      ) as HTMLInputElement | null;
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
            <>
              <InputField
                id="otp"
                label="Enter OTP"
                type={showOtp ? "text" : "password"}
                placeholder="Enter the 6-digit OTP"
                value={formData.otp}
                onChange={handleChange}
                icon={
                  <div
                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                    onClick={() => setShowOtp((prev) => !prev)}
                  >
                    {showOtp ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.965 9.965 0 012.395-4.408M6.11 6.11L3 3m3.75 3.75a9.963 9.963 0 014.14-1.19M21 21l-3.75-3.75m-1.462-1.462A9.965 9.965 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.964 9.964 0 012.395-4.408"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </div>
                }
              />

              <p className="text-sm text-gray-500">
                Time left:{" "}
                <span className="font-semibold text-red-500">
                  {formatTime(timer)}
                </span>
              </p>
            </>
          )}

          <button
            type="submit"
            className={`w-full py-2 rounded-md mt-4 text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? (
              <span className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                {showOtpField ? "Verifying..." : "Sending..."}
              </span>
            ) : showOtpField ? (
              "Verify OTP"
            ) : (
              "Get OTP"
            )}
          </button>

          <p className="text-gray-600 mt-4">
            {signup ? "Already have an account? " : "Don’t have an account? "}
            <span
              className="text-blue-500 underline cursor-pointer"
              onClick={handleSwitch}
            >
              {signup ? "Sign in" : "Sign up"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
