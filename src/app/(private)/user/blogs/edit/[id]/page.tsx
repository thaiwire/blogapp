import PageTitle from "@/components/functional/page-title";
import React from "react";
import BlogForm from "../../_common/blog-form";
import { getBlogById } from "@/server-actions/blogs";

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = await params;
  const blogResponse = await getBlogById(id);
  if (!blogResponse.success) {
    return <div>Blog not found</div>;
  }

  const blog = blogResponse.data;

  return (
    <div>
      <PageTitle title="Edit Blog" />
      <BlogForm formType="edit" blog={blog} />
    </div>
  );
}

export default EditBlogPage;
