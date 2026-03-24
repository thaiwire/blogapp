"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { blogsCategories } from "@/constants/inex";
import { Textarea } from "@/components/ui/textarea";
import Editor from "react-simple-wysiwyg";
import { addBlog, updateBlog } from "@/server-actions/blogs";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
  description: z.string().min(1, "Description must be at least 1 character."),
  category: z.string().min(1, "Category is required."),
  content: z.string().min(1, "Content must be at least 1 character."),
});

function BlogForm({ formType }: { formType: "add" | "edit" }) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [content, setContent] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      category: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      let response;
      if (formType === "add") {
        response = await addBlog({ ...values, content: content });
      }
      if (response?.success) {
        toast.success(response?.message || "Blog added successfully.");
        router.push("/user/blogs");
      } else {
        toast.error(
          response?.message || "An error occurred. Please try again.",
        );
      }

      console.log("Form values:", values);
    } catch (error: any) {
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-7">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-4 gap-5">
          <div className="col-span-3">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  type="text"
                  placeholder="Enter your blog title"
                  aria-invalid={!!form.formState.errors.title}
                  {...form.register("title")}
                />
                <FieldError errors={[form.formState.errors.title]} />
              </Field>
            </FieldGroup>
          </div>
          <div className="col-span-1">
            <Field>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <Controller
                control={form.control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {blogsCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[form.formState.errors.category]} />
            </Field>
          </div>
        </div>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              placeholder="Enter your blog description"
              aria-invalid={!!form.formState.errors.description}
              {...form.register("description")}
            />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>
        </FieldGroup>
        <div>
          <h1 className="text-sm">Content</h1>
          <Editor
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              form.setValue("content", e.target.value, {
                shouldValidate: true,
              });
            }}
            className="border border-gray-300 rounded-md p-2 text-sm"
          />
          <FieldError errors={[form.formState.errors.content]} />
        </div>

        <div>
          <h1 className="text-sm">Upload Image</h1>
          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setSelectedFile(file);
            }}
          />
          {selectedFile && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Selected"
              className="mt-2 w-20 h-20 object-cover rounded-md border border-gray-300"
            />
          )}
        </div>
        <div className="flex justify-end gap-5">
          <Button variant={"outline"}> Cancel</Button>
          <Button type="submit" disabled={!form.formState.isValid || loading}>
            {formType === "add" ? "Add Blog" : "Update Blog"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default BlogForm;
