"use client";

import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginUser } from "@/server-actions/users";
import Cookies from "js-cookie";


const registerSchema = z.object({
 
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be at most 72 characters."),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();


  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
     
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
        setLoading(true);

        const response :any = await loginUser(values.email, values.password);
        if (response.success) {
         
          // Store the token in a cookie
          Cookies.set("user_token", response.token); 
          toast.success(response.message);  
          router.push("/user/dashboard");
        } else {
          toast.error(response.message);
        }


    } catch (error:any) {
      toast.error("An error occurred during login. Please try again.")
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-parent px-6 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl shadow-black/10 ring-1 ring-black/5">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-sky-700">
            RealTime Blogging App
          </p>
          <h1 className="text-3xl font-semibold text-slate-900">
            Sign in to your account
          </h1>
          <p className="text-sm text-slate-600">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-sky-700 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>

        
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
            <FieldGroup>
             

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  aria-invalid={!!form.formState.errors.email}
                  {...form.register("email")}
                />
                <FieldError errors={[form.formState.errors.email]} />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  aria-invalid={!!form.formState.errors.password}
                  {...form.register("password")}
                />
                <FieldError errors={[form.formState.errors.password]} />
              </Field>
            </FieldGroup>

            <div className="flex items-center justify-between mt-6 ">
              <Link
                href="/register"
                className="text-sm underline font-bold"
              >
                Don't have an account?
              </Link>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Signing in…"
                  : "Sign in"}
              </Button>
            </div>
          </form>
        
      </div>
    </div>
  );
}

export default LoginPage;
