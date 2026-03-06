"use client";
import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginUser } from "@/server-actions/users";
import Cookies from "js-cookie";


const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

function LoginPage() {

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
   // 1 . Define your form.   

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
   // 2. Define submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const response = await loginUser(values.email, values.password);
      if (response.success && response.data) {
        Cookies.set("user_token", response.data, {
          expires: 1,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        });
        toast.success(response.message);
        router.push("/user/dashboard");
      } else if (response.success && !response.data) {
        toast.error("Login succeeded but no token was returned.");
      } else {
        toast.error(response.message);
      }


      
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during login.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="auth-parent">
      <div className="bg-white p-5 rounded-xl w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <h1 className="text-xl font-bold">Login to your account</h1>
            <hr className="border-gray-300 border" />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <Link href="/register" className="text-smunderline">
                New an account? Register
              </Link>
              <Button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default LoginPage;
