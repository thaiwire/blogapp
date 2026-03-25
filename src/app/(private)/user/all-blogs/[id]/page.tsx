"use client";

import PageTitle from "@/components/functional/page-title";
import Spinner from "@/components/ui/spinner";
import { IBlog } from "@/interfaces";
import { getBlogById } from "@/server-actions/blogs";
import dayjs from "dayjs";
import { HeartIcon, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

function BlogInfoPage() {
  const params = useParams();
  const [loading, setLoading] = React.useState(true);
  const [blog, setBlog] = React.useState<IBlog | null>(null);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      if (params.id) {
        const response = await getBlogById(params.id as string);
        setBlog(response.data);
      }
    } catch (error) {
      toast.error("Failed to fetch blog data");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBlog();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <Spinner />
      </div>
    );
  }

  if (!blog && !loading) {
    return <div className="text-sm">Blog not found</div>;
  }

  return (
    <div className="flex flex-col gap-5 items-start">
      <div>
        <PageTitle title={blog?.title || "Blog Info"} />
        <div className="flex gap-20">
          <h1 className="text-sm">
            Author :{" "}
            <span className="font-medium">
              {blog?.author?.name || "unknown"}
            </span>
          </h1>
          <h1 className="text-sm">
            Created At :{" "}
            {dayjs(blog?.created_at).format("MMMM D, YYYY h:mm A") || "unknown"}
          </h1>
        </div>
      </div>
      <img
        src={blog?.image}
        alt={blog?.title}
        className="h-60 object-contain rounded-lg"
      />
      <div>
        {blog?.content.split("\n").map((paragraph, index) => (
          <p key={index} className="mb-2">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="flex gap-10">
        <div className="text-sm text-gray-700">
          <HeartIcon className=" cursor-pointer" size={18} />
          {blog?.likes_count || 0} Likes
        </div>

        <div className="text-sm text-gray-700">
          <MessageCircle className=" cursor-pointer" size={18} />
          {blog?.comments_count || 0} Comments
        </div>

      </div>
    </div>
  );
}

export default BlogInfoPage;
