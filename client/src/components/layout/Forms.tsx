import { useState, useEffect } from "react";
import InputField from "../ui/InputField";
import { useNavigate } from "react-router-dom";

export default function Forms() {
  const [signup, setSignup] = useState(true);
  const [signUpData, setSignUpData] = useState({ name: "", dob: "", email: "", otp: "" });
  const [signInData, setSignInData] = useState({ email: "", otp: "" });
  const [showOtpField, setShowOtpField] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (signup) setSignUpData({ ...signUpData, [e.target.id]: e.target.value });
    else setSignInData({ ...signInData, [e.target.id]: e.target.value });
  };

  const handleGetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const url = signup
        ? "http://localhost:8000/api/auth/signup/send-otp"
        : "http://localhost:8000/api/auth/signin/send-otp";

      const body = signup ? signUpData : signInData;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const url = signup
        ? "http://localhost:8000/api/auth/signup/verify-otp"
        : "http://localhost:8000/api/auth/signin/verify-otp";

      const body = signup ? signUpData : signInData;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
    <div className="h-[80%] w-full flex justify-center items-start md:items-center">
      <div className="w-full md:w-[80%] p-4 md:p-12 flex flex-col items-center md:items-start">
        {/* SIGN UP FORM */}
        {signup && (
          <div className="w-full max-w-md md:mt-12">
            <h2 className="text-black text-2xl md:text-4xl font-bold mt-8 mb-4 text-center md:text-left">
              Sign Up
            </h2>
            <p className="text-gray-500 mb-4 text-center md:text-left">
              Sign up to enjoy the feature of HD
            </p>

            {error && <p className="text-red-500 font-semibold mb-2 text-center md:text-left">{error}</p>}
            {success && <p className="text-green-500 font-semibold mb-2 text-center md:text-left">{success}</p>}

            <form onSubmit={showOtpField ? handleSubmit : handleGetOtp} className="space-y-4 w-full">
              <InputField
                id="name"
                label="Your Name"
                type="text"
                placeholder="Enter Your Name"
                value={signUpData.name}
                onChange={handleChange}
              />
              <InputField
                id="dob"
                label="Date of Birth"
                type="date"
                value={signUpData.dob}
                onChange={handleChange}
              />
              <InputField
                id="email"
                label="Email"
                type="email"
                placeholder="youremail@xyz"
                value={signUpData.email}
                onChange={handleChange}
              />

              {showOtpField && (
                <InputField
                  id="otp"
                  label="OTP"
                  type={showOtp ? "text" : "password"}
                  placeholder="Enter OTP"
                  value={signUpData.otp}
                  onChange={handleChange}
                  icon={
                    <div onClick={() => setShowOtp((prev) => !prev)}>
                      {showOtp ? "Hide" : "Show"}
                    </div>
                  }
                />
              )}

              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded"
              >
                {showOtpField ? "Verify OTP" : "Get OTP"}
              </button>
            </form>

            <p className="mt-4 text-center md:text-left">
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => { setSignup(false); setShowOtpField(false); setError(null); setSuccess(null); }}
              >
                Sign In
              </span>
            </p>
          </div>
        )}

        {/* SIGN IN FORM */}
        {!signup && (
          <div className="w-full max-w-md mt-4 md:mt-12">
            <h2 className="text-black text-2xl md:text-4xl font-bold mt-8 mb-4 text-center md:text-left">
              Sign In
            </h2>
            <p className="text-gray-500 mb-4 text-center md:text-left">
              Sign in to access your account
            </p>

            {error && <p className="text-red-500 font-semibold mb-2 text-center md:text-left">{error}</p>}
            {success && <p className="text-green-500 font-semibold mb-2 text-center md:text-left">{success}</p>}

            <form onSubmit={showOtpField ? handleSubmit : handleGetOtp} className="space-y-4 w-full">
              <InputField
                id="email"
                label="Email"
                type="email"
                placeholder="youremail@xyz"
                value={signInData.email}
                onChange={handleChange}
              />

              {showOtpField && (
                <InputField
                  id="otp"
                  label="OTP"
                  type={showOtp ? "text" : "password"}
                  placeholder="Enter OTP"
                  value={signInData.otp}
                  onChange={handleChange}
                  icon={
                    <div onClick={() => setShowOtp((prev) => !prev)}>
                      {showOtp ? "Hide" : "Show"}
                    </div>
                  }
                />
              )}

              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded"
              >
                {showOtpField ? "Verify OTP" : "Get OTP"}
              </button>
            </form>

            <p className="mt-4 text-center md:text-left">
              Don’t have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => { setSignup(true); setShowOtpField(false); setError(null); setSuccess(null); }}
              >
                Sign Up
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
