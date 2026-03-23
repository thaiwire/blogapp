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
import toast from "react-hot-toast";
import { registerUser } from "@/server-actions/users";
import { useRouter } from "next/navigation";


const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(24, "Name must be at most 24 characters."),
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(72, "Password must be at most 72 characters."),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterPage() {

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
        setLoading(true);

      const response = await registerUser(values);
      if (response.success) {
        toast.success(response.message);
        router.push("/login");

      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while creating the account.",
      );
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
            Create account
          </h1>
          <p className="text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-sky-700 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                placeholder="Your name"
                aria-invalid={!!form.formState.errors.name}
                {...form.register("name")}
              />
              <FieldError errors={[form.formState.errors.name]} />
            </Field>

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
            <Link href="/login" className="text-sm underline font-bold">
              Already have an account?
            </Link>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Creating account…"
                : "Create account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
