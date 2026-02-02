import React from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { useNavigate, useLocation } from "react-router-dom";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on signup mode via URL parameter
  const searchParams = new URLSearchParams(location.search);
  const isSignUp = searchParams.get("mode") === "signup";

  const handleSignInClick = () => {
    navigate("/login");
  };

  const handleSignUpClick = () => {
    navigate("/login?mode=signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUp ? "Create your account" : "Sign in to OBO HUB"}
          </h2>
        </div>

        <div className="flex justify-center">
          {isSignUp ? (
            <SignUp
              redirectUrl="/account"
              afterSignUpUrl="/account"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-xl rounded-lg",
                  formButtonPrimary:
                    "bg-black hover:bg-gray-800 text-sm normal-case",
                },
              }}
            />
          ) : (
            <SignIn
              redirectUrl="/account"
              afterSignInUrl="/account"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-xl rounded-lg",
                  formButtonPrimary:
                    "bg-black hover:bg-gray-800 text-sm normal-case",
                },
              }}
            />
          )}
        </div>

        <div className="text-center">
          {isSignUp ? (
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={handleSignInClick}
                className="font-medium text-black hover:text-gray-700 underline"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={handleSignUpClick}
                className="font-medium text-black hover:text-gray-700 underline"
              >
                Sign up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
