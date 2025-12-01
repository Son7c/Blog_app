import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Login Page - User authentication form
 *
 * KEY CONCEPTS:
 * - Form state management with controlled inputs
 * - useLocation: gets where user came from (for redirect after login)
 * - localStorage: saves user data for persistence
 * - Custom events: dispatches "authChange" to notify other components
 * - Redirect logic: sends user back to intended page after login
 */

const Login = () => {
    // Form state
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { email, password } = formData;

    const navigate = useNavigate();
    const location = useLocation(); // Contains previous page info
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState(null);

    // Check if user is already logged in
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        }
    }, [navigate, location]);

    const reset = () => {
        setIsError(false);
        setIsSuccess(false);
        setMessage("");
    };

    // Handle login success/error
    useEffect(() => {
        if (isError && message) {
            toast.error(message);
        }

        if (isSuccess && user) {
            // Save user to localStorage (persists across page refreshes)
            localStorage.setItem("user", JSON.stringify(user));

            // Dispatch custom event so Navbar and other components update
            window.dispatchEvent(new Event("authChange"));

            toast.success("Welcome back!");

            // Redirect to page they were trying to access, or home
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        }

        return () => {
            reset();
        };
    }, [isSuccess, isError, message, user, navigate, location]);

    // Handle input changes - updates state as user types
    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState, // Keep existing values
            [e.target.name]: e.target.value, // Update this field
        }));
    };

    // Form submit - simulates login (replace with real API call)
    const onSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        const userData = {
            email,
            password,
        };

        // TODO: Replace with real backend API call
        setIsLoading(true);
        setTimeout(() => {
            // btoa() encodes string to base64 (simple ID generation)
            const loggedInUser = {
                _id: btoa(userData.email),
                name: "Test User",
                email: userData.email,
            };
            setIsLoading(false);
            setIsSuccess(true);
            setUser(loggedInUser);
        }, 1500);
    };

    if (isLoading) {
        return <LoadingSpinner text="Signing in..." />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-serif font-bold text-zinc-900 mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-zinc-600">
                        Sign in to continue your journey
                    </p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-zinc-100/50 border border-zinc-100 p-8 sm:p-10">
                    <form className="space-y-6" onSubmit={onSubmit}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-zinc-700 mb-2 uppercase tracking-wider"
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={onChange}
                                required
                                className="input-field"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-zinc-700 mb-2 uppercase tracking-wider"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={password}
                                onChange={onChange}
                                required
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="w-full btn-primary">
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-zinc-100">
                        <p className="text-sm text-zinc-600">
                            Don't have an account?{" "}
                            <Link
                                to="/register"
                                className="font-medium text-black hover:underline transition-all"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
