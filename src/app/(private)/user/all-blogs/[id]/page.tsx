"use client";

import useUserStore, { IUserStore } from "@/app/global-store/users-store";
import PageTitle from "@/components/functional/page-title";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { IBlog, ILike } from "@/interfaces";
import { getBlogById } from "@/server-actions/blogs";
import { getLikesOfBlog, likeBlog, unlikeBlog } from "@/server-actions/likes";
import dayjs from "dayjs";
import { HeartIcon, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import CommentForm from "../_component/comment-form";
import { addNotification } from "@/server-actions/notifications";
import socket from "@/config/socket-config";




function BlogInfoPage() {
  const params = useParams();
  const [loading, setLoading] = React.useState(true);
  const [blog, setBlog] = React.useState<IBlog | null>(null);
  const [likes, setLikes] = React.useState<ILike[]>([]);
  const [openCommentForm, setOpenCommentForm] = React.useState(false);
  const { user } = useUserStore() as IUserStore;

  const fetchBlog = async () => {
    setLoading(true);
    try {
      if (params.id) {
        const response = await getBlogById(params.id as string);
        setBlog(response.data);
        const likesResponse = await getLikesOfBlog(params.id as string);
        if (likesResponse.success) {
          setLikes(likesResponse.data || []);
        } else {
          toast.error("Failed to fetch likes data");
        }
      }
    } catch (error) {
      toast.error("Failed to fetch blog data");
    } finally {
      setLoading(false);
    }
  };

  const reloadComments = async () => {
    const updateBlog: any = {
      ...blog,
      comments_count: (blog?.comments_count || 0) + 1,
    };
    setBlog(updateBlog);
  };

  const likeUnlikeHandler = async () => {
    // Implement like/unlike functionality here
    try {
      const isLiked = likes.some((like) => like.user_id === user?.id);
      let response = null;
      if (isLiked) {
        response = await unlikeBlog(
          blog?.id as string,
          user?.id as string,
          likes?.length - 1,
        );
      } else {
        response = await likeBlog(
          blog?.id as string,
          user?.id as string,
          likes?.length + 1,
        );
        
        const notificationPayload = {
          user_id: blog?.author?.id as string,
          blog_id: blog?.id,
          type: "like",
          content: `${user?.name} liked your blog "${blog?.title}"`,
          is_read: false,
        };

        addNotification(notificationPayload);

        socket.emit("send-notification", { 
          userId: blog?.author?.id,
          notification: notificationPayload,
         });

      }
      if (!response.success) {
        toast.error(response.error || "Failed to update like/unlike status");
        return;
      }

      setLikes((prevLikes: any) => {
        if (isLiked) {
          return prevLikes.filter((like: ILike) => like.user_id !== user?.id);
        } else {
          return [
            ...prevLikes,
            {
              id: new Date().getTime(),
              user_id: user?.id as string,
              blog_id: blog?.id as string,
              created_at: new Date().toISOString(),
              user: user,
            },
          ];
        }
      });
    } catch (error) {
      toast.error("Failed to update like/unlike status");
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
      <div className="flex justify-between item-center w-full">
        <div className="flex gap-10">
          <div className="text-sm text-gray-700">
            <HeartIcon
              className=" cursor-pointer"
              size={18}
              color={
                likes.some((like) => like.user_id === user?.id) ? "red" : "grey"
              }
              fill={
                likes.some((like) => like.user_id === user?.id) ? "red" : "none"
              }
              onClick={likeUnlikeHandler}
            />
            <h1 className="text-sm text-gray-700 underline">
              {likes.length || 0} Likes
            </h1>
          </div>

          <div className="text-sm text-gray-700">
            <MessageCircle className=" cursor-pointer" size={18} />
            <h1 className="text-sm text-gray-700 underline">
              {blog?.comments_count || 0} Comments
            </h1>
          </div>
        </div>
        <Button onClick={() => setOpenCommentForm(true)}>Add Comment</Button>
      </div>

      {openCommentForm && (
        <CommentForm
          openCommentForm={openCommentForm}
          setOpenCommentForm={setOpenCommentForm}
          reloadComments={reloadComments}
          blog={blog as IBlog}
        />
      )}
    </div>
  );
}

export default BlogInfoPage;
