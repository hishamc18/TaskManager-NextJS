"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/slices/authSlice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/Toast";

export default function RegisterPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { user, loading, error } = useSelector((state) => state.auth);
    const { showToast } = useToast()

    useEffect(() => {
        if (user) router.replace("/");
    }, [user, router]);

    const formik = useFormik({
        initialValues: { username: "", email: "", password: "", confirmPassword: "" },
        validationSchema: Yup.object({
            username: Yup.string().required("Name is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm password is required"),
        }),
        onSubmit: (values) =>
            dispatch(registerUser(values)).then((res) => {
                showToast(res.payload.message);
            }),
    });

    return (
        <div className="flex h-screen bg-white text-black">
            <div className="w-2/3 hidden lg:flex items-center justify-center">
                <img src="/auth.png" alt="Task Management" />
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                    <h3 className="text-3xl font-bold text-center mb-6 text-gray-800">Create an Account</h3>

                    <form onSubmit={formik.handleSubmit}>
                        {["username", "email", "password", "confirmPassword"].map((field, index) => (
                            <div key={index} className="mb-1">
                                <input
                                    type={field.includes("password") ? "password" : "text"}
                                    name={field}
                                    placeholder={
                                        field === "confirmPassword"
                                            ? "Confirm Password"
                                            : field.charAt(0).toUpperCase() + field.slice(1)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    {...formik.getFieldProps(field)}
                                />
                                <p className="text-red-500 text-[12px] min-h-[20px]">
                                    {formik.touched[field] && formik.errors[field]}
                                </p>
                            </div>
                        ))}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:opacity-90 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || !formik.isValid || !formik.dirty}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>

                        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                    </form>

                    <p className="text-center text-gray-600 mt-6 text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
