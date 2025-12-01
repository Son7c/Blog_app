import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Register Page - New user signup form
 *
 * KEY CONCEPTS:
 * - Form validation: checks if passwords match before submitting
 * - Multiple input fields managed in single state object
 * - Similar flow to Login: save user, dispatch event, redirect
 * - Local error state for client-side validation
 */

const Register = () => {
    // ADD FUNCTIONALITY HERE
    // IT'S QUITE SIMILAR TO LOGIN PAGE

    // ADD REQUIRED STATES

    // Check if user is already logged in

    // Handle input changes - updates state as user types

    // Form submit - validates passwords match, then creates account
    

    if (isLoading) {
        return <LoadingSpinner text="Creating account..." />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-serif font-bold text-zinc-900 mb-2">
                        Create Account
                    </h2>
                    <p className="text-zinc-600">Join our community today</p>
                </div>

                <div className="bg-white rounded-3xl shadow-xl shadow-zinc-100/50 border border-zinc-100 p-8 sm:p-10">
                    <form className="space-y-5" onSubmit={onSubmit}>
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-zinc-700 mb-2 uppercase tracking-wider"
                            >
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={name}
                                onChange={onChange}
                                required
                                className="input-field"
                                placeholder="John Doe"
                            />
                        </div>

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

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-zinc-700 mb-2 uppercase tracking-wider"
                            >
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={onChange}
                                required
                                className="input-field"
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="w-full btn-primary">
                            Create Account
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-zinc-100">
                        <p className="text-sm text-zinc-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-medium text-black hover:underline transition-all"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
