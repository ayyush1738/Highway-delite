import { useState } from "react"

export default function Forms() {
    const [signup, setSignup] = useState(true);

    return (
        <div className="h-[80%] w-full flex justify-center items-center align-middle">
            {signup ? (
                <div className="w-[80%] h-[80%] p-12">
                    <h2 className="text-black text-4xl font-bold mb-2">Sign up</h2>
                    <p className="text-gray-500">Sign up to enjoy the feature of HD</p>
                    <label
                        htmlFor="dob"
                        className="relative top-3 left-2 bg-white text-gray-500 px-1 text-sm"
                    >
                        Date of Birth
                    </label>

                    {/* Input with icon */}
                    <div className="flex items-center border border-gray-400 rounded-md px-3 py-2">
                        {/* Icon (calendar) */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>

                        <input
                            type="text"
                            id="dob"
                            placeholder="11 December 1997"
                            className="w-full bg-transparent outline-none text-gray-700"
                        />
                    </div>
                </div>
            ) : (
                <div>

                </div>
            )}
        </div>
    )
}