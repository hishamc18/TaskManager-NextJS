"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/Toast";

export default function LoginPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { error, user, loading } = useSelector((state) => state.auth);
    const { showToast } = useToast()

    useEffect(() => {
        if (user) {
            router.replace("/");
        }
    }, [user, router]);

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().required("Password is required"),
        }),
        onSubmit: (values) => {
            dispatch(loginUser(values)).then((res) => {
                showToast(res.payload.message);
            });
        },
    });

    return (
        <div className="flex h-screen bg-white text-black">
            <div className="w-2/3 hidden lg:flex items-center justify-center bg-white">
                <img src="/auth.png" alt="Task Management" />
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Welcome Back!</h2>

                    <form onSubmit={formik.handleSubmit}>
                        <div className="mb-2">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                                {...formik.getFieldProps("email")}
                            />
                            <div className="h-5">
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-[12px] text-red-500 text-sm">{formik.errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-2">
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                                {...formik.getFieldProps("password")}
                            />
                            <div className="h-5">
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-[12px] text-red-500 text-sm">{formik.errors.password}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:opacity-90 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={loading || !formik.isValid || !formik.dirty}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                        <div className="h-6 mt-2">{error && <p className="text-red-500 text-center">{error}</p>}</div>
                    </form>

                    <p className="text-[14px] text-center text-gray-600 mt-6">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                            Create!
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
