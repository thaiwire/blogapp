"use client";

import PageTitle from "@/components/functional/page-title";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useUserStore, { IUserStore } from "@/app/global-store/users-store";
import toast from "react-hot-toast";
import { deleteBlog, getBlogByAuthor } from "@/server-actions/blogs";
import { IBlog } from "@/interfaces";
import dayjs from "dayjs";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";

function AllBlogsPage() {
  const [blogs, setBlogs] = React.useState<IBlog[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { user } = useUserStore() as IUserStore;
  const router = useRouter();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response: any = await getBlogByAuthor(user?.id!);
      if (response.success) {
        setBlogs(response.data);
      } else {
        toast.error("Failed to fetch blogs. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to fetch blogs. Please try again.");
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    try {
      setLoading(true);
      const response: any = await deleteBlog(blogId);
      if (response.success) {
        toast.success("Blog deleted successfully.");
        //  fetchBlogs();
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== blogId));
      } else {
        toast.error("Failed to delete blog. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to delete blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [user]);

  const columns = ["Title", "Category", "Status", "Created At", "Actions"];

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-between items-center">
        <PageTitle title="My Blogs" />
        <Button>
          <Link href="/user/blogs/add">Create New Blog</Link>
        </Button>
      </div>

     


      <Table>
        <TableHeader>
          <TableRow className="bg-gray-300">
            {columns.map((column) => (
              <TableHead key={column} className="text-left font-semibold p-2">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell className="font-medium">{blog.title}</TableCell>
              <TableCell>{blog.category}</TableCell>
              <TableCell>{blog.is_active ? "Active" : "Inactive"}</TableCell>
              <TableCell>
                {dayjs(blog.created_at).format("DD MMM YYYY hh:mm A")}
              </TableCell>
              <TableCell>
                <div className="flex gap-5">
                  <Button
                    size={"icon"}
                    variant="secondary"
                    onClick={() => handleDeleteBlog(blog.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/user/blogs/edit/${blog.id}`)}
                  >
                    <Edit2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AllBlogsPage;
