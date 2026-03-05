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
import toast from "react-hot-toast";
import { registerUser } from "@/server-actions/users";
import { useRouter } from "next/navigation";


const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

function RegisterPage() {
  
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
     try {
       setLoading(true);
        const response = await registerUser(data);

        if (response.success) {
          toast.success(response.message);
          router.push("/login");
        } else {
          toast.error(response.message);
        }
     } catch (error ) {
      toast.error("Registration failed: " + (error as Error).message);
     } finally {
      setLoading(false);
     }
  }

  return (
    <div className="auth-parent">
      <div className="bg-white p-5  rounded-xl w-[450px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <h1 className="text-xl font-bold">Register your account</h1>
            <hr className="border-gray-300 border" />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
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
            <Link href="/login" className="text-smunderline">
              Already have an account? Login
            </Link> 
            <Button type="submit"
              disabled={loading}>
              Register
            </Button>
           </div> 
          </form>
        </Form>
      </div>
    </div>
  );
}

export default RegisterPage;
