import { useState, useEffect } from "react";
import InputField from "../ui/InputField";
import { useNavigate } from "react-router-dom";
import { Calendar, Loader2 } from "lucide-react"; // Loader2 for spinner

export default function Forms() {
  const [signup, setSignup] = useState(true);
  const [signUpData, setSignUpData] = useState({ name: "", dob: "", email: "", otp: "" });
  const [signInData, setSignInData] = useState({ email: "", otp: "" });
  const [showOtpField, setShowOtpField] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false); // Track if OTP has been sent for sign-in

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
      const url = "http://localhost:8000/api/auth/signup/send-otp";
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
      const res = await fetch("http://localhost:8000/api/auth/signin/send-otp", {
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
      setOtpSent(true); // Mark that OTP has been sent
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
    let interval: number | undefined;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const resetForms = () => {
      setError(null);
      setSuccess(null);
      setShowOtpField(false);
      setOtpSent(false);
      setTimer(0);
  }

  return (
    <div className="h-[80%] w-full flex justify-center items-start md:items-center">
      <div className="w-full md:w-[80%] p-4 md:p-12 flex flex-col items-center md:items-start">
        
        {/* SIGN UP FORM */}
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
                className={`w-full py-2 flex justify-center items-center rounded ${loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                    Processing...
                  </>
                ) : (
                  showOtpField ? "Verify OTP & Sign Up" : "Get OTP"
                )}
              </button>
            </form>

            <p className="mt-4 text-center md:text-left text-gray-600">
              Already have an account?{" "}
              <span
                className="text-blue-500 cursor-pointer underline"
                onClick={() => { setSignup(false); resetForms(); }}
              >
                Sign in
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
        

                <button onClick={handleSignInOtpRequest} ><div className="font-bold text-sm py-2 flex justify-center items-center rounded text-blue-500 underline">Resend OTP</div></button>
            


              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 flex justify-center items-center rounded ${loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"} text-white`}
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