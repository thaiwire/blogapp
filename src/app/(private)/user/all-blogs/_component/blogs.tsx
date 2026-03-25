'use client';
import { IBlog } from "@/interfaces";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React from "react";

function Blog({ blog }: { blog: IBlog }) {
  const router = useRouter();
  return (
    <div 
    onClick={() => router.push(`/user/all-blogs/${blog.id}`)}
    className="p-5 border border-gray-500 rounded grid grid-cols-4 gap-7 items-center
    cursor-pointer hover:bg-gray-100 transition">
      <div className="col-span-1">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-32 object-cover rounded"
        />
      </div>
      <div className="col-span-3 flex flex-col gap-5 p-5">
        <h1 className="text-lg font-semibold">{blog.title}</h1>
        <p className="text-sm text-gray-600">{blog.description}</p>
        <hr className="border-gray-300 my-3" />
        <div className="flex gap-20">
          <h1 className="text-sm text-gray-500">
            Author : {blog.author?.name || "Unknown"}
          </h1>
          <h1 className="text-sm text-gray-500">
            Published on: {dayjs(blog.created_at).format("DD MMM YYYY hh:mm A")}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default Blog;
