import { useState, useEffect } from "react";
import InputField from "../ui/InputField";
import { useNavigate } from "react-router-dom";
import { Calendar, Loader2 } from "lucide-react"; 

const API_URL =  import.meta.env.VITE_API_URL

export default function Forms() {
  const [signup, setSignup] = useState(true);
  const [signUpData, setSignUpData] = useState({ name: "", dob: "", email: "", otp: "" });
  const [signInData, setSignInData] = useState({ email: "", otp: "" });
  const [showOtpField, setShowOtpField] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false); // State for the checkbox

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (signup) {
      setSignUpData({ ...signUpData, [e.target.id]: e.target.value });
    } else {
      setSignInData({ ...signInData, [e.target.id]: e.target.value });
    }
  };

  const handleSignUpOtpRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const url = `${API_URL}/api/auth/signup/send-otp`;
      const body = { name: signUpData.name, dob: signUpData.dob, email: signUpData.email };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
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

  const handleSignInOtpRequest = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!signInData.email) {
      setError("Please enter your email to receive an OTP.");
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`${API_URL}/api/auth/signin/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signInData.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }

      setTimer(300); // Start the resend timer
      setSuccess("OTP sent successfully! Check your email.");
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false); // Set loading false after OTP request
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const url = signup
        ?  `${API_URL}/api/auth/signup/verify-otp`
        :  `${API_URL}/api/auth/signin/verify-otp`;

      // The body sent to the backend should be signInData, keepLoggedIn is a client-side preference
      const body = signup ? signUpData : signInData;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        if (keepLoggedIn) {
          // just store raw token
          localStorage.setItem("token", data.token);
        } else {
          // wrap with expiry in another key
          const expiry = Date.now() + 60 * 60 * 1000; // 1 hour
          localStorage.setItem("token", data.token);
          localStorage.setItem("expiry", expiry.toString());
        }
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
    let interval: ReturnType<typeof setInterval> | undefined;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);


  const resetForms = () => {
    setError(null);
    setSuccess(null);
    setShowOtpField(false);
    setTimer(0);
    setKeepLoggedIn(false); // Also reset the checkbox state
    // It's good practice to clear form data on switch as well
    setSignUpData({ name: "", dob: "", email: "", otp: "" });
    setSignInData({ email: "", otp: "" });
  }

  return (
    <div className="h-[80%] w-full flex justify-center items-start md:items-center">
      <div className="w-full md:w-[80%] p-4 md:p-12 flex flex-col items-center md:items-start">

        {signup && (
          <div className="w-full max-w-md md:mt-12">
            <h2 className="text-black text-2xl md:text-4xl font-bold mt-2 md:mt-8 mb-4 text-center md:text-left">
              Sign Up
            </h2>
            <p className="text-gray-500 mb-4 text-center md:text-left">
              Sign up to enjoy the feature of HD
            </p>

            {error && <p className="text-red-500 font-semibold mb-2 text-center md:text-left">{error}</p>}
            {success && <p className="text-green-500 font-semibold mb-2 text-center md:text-left">{success}</p>}

            <form onSubmit={showOtpField ? handleSubmit : handleSignUpOtpRequest} className="space-y-4 w-full">
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
                icon={<Calendar className="w-5 h-5" />}
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
                  type="password"
                  placeholder="Enter OTP"
                  value={signUpData.otp}
                  onChange={handleChange}
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 cursor-pointer flex justify-center items-center rounded ${loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Processing...
                  </>
                ) : (
                  showOtpField ? "Sign up" : "Get OTP"
                )}
              </button>
            </form>

            <p className="mt-4 flex justify-center text-center md:text-left text-gray-600">
              Already have an account?{" "}
              <span
                className="text-blue-500 ml-1 cursor-pointer underline"
                onClick={() => { setSignup(false); resetForms(); }}
              >
                Sign in
              </span>
            </p>
          </div>
        )}

        {!signup && (
          <div className="w-full max-w-md md:mt-12">
            <h2 className="text-black text-2xl md:text-4xl font-bold mt-2 md:mt-8 mb-4 text-center md:text-left">
              Sign In
            </h2>
            <p className="text-gray-500 mb-4 text-center md:text-left">
              Sign in to access your account
            </p>

            {error && <p className="text-red-500 font-semibold mb-2 text-center md:text-left">{error}</p>}
            {success && <p className="text-green-500 font-semibold mb-2 text-center md:text-left">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <InputField
                id="email"
                label="Email"
                type="email"
                placeholder="youremail@xyz"
                value={signInData.email}
                onChange={handleChange}
              />

              <InputField
                id="otp"
                label="OTP"
                type="password"
                placeholder="Enter OTP"
                value={signInData.otp}
                onChange={handleChange}
              />

              <div className="flex justify-between flex-col items-start">
                <button
                  type="button"
                  onClick={handleSignInOtpRequest}
                  disabled={timer > 0 || loading}
                  className="font-bold mb-4 cursor-pointer text-sm text-blue-500 underline disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                </button>
                <div className="flex items-center">
                  <input
                    id="keepLoggedIn"
                    type="checkbox"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    className="peer h-4 w-4 appearance-none rounded border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 relative"
                  />
                  <span className="pointer-events-none absolute cursor-pointer border-2 rounded border-gray-800 w-4 h-4 flex items-center justify-center text-white text-[10px] font-bold peer-checked:flex">
                    ✔
                  </span>
                  <label htmlFor="keepLoggedIn" className="ml-2 text-sm text-gray-700">
                    Keep me logged in
                  </label>

                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 cursor-pointer flex justify-center items-center rounded ${loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="mt-4 text-center md:text-left text-gray-600">
              Need an account?{" "}
              <span
                className="text-blue-500 cursor-pointer underline"
                onClick={() => { setSignup(true); resetForms(); }}
              >
                Create one
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}