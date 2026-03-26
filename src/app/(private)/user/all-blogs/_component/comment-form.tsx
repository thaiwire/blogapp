'use client';
import { IBlog } from "@/interfaces";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/server-actions/comments";
import toast from "react-hot-toast";
import useUserStore, { IUserStore } from "@/app/global-store/users-store";


interface CommentFormProps {
  openCommentForm: boolean;
  setOpenCommentForm: React.Dispatch<React.SetStateAction<boolean>>;
  reloadComments: () => void;
  blog?: IBlog;
}
function CommentForm({
  openCommentForm,
  setOpenCommentForm,
  reloadComments,
  blog,
}: CommentFormProps) {
  const { user } = useUserStore() as IUserStore;
  const [content, setContent] = React.useState("");
  const [loading, setLoading] = React.useState(false);


  const handleSubmit = async () => {
    if (!blog?.id || !user?.id) {
      toast.error("You must be logged in to comment");
      return;
    }

    const trimmedContent = content.trim();
    if (!trimmedContent) {
      return;
    }

    try {
        setLoading(true);
        const response = await createComment({
            blogId: blog?.id!,
            userId: user?.id!,
            content: trimmedContent,
            newCommentsCount: (blog?.comments_count || 0) + 1,
        });

        if ((response as { success?: boolean }).success === false) {
          toast.error(response.message || "Failed to add comment");
          return;
        }

        reloadComments();
        setContent("");
        setOpenCommentForm(false);
        toast.success("Comment added successfully");

    } catch (error) {
        toast.error("Failed to add comment");
    } finally {
        setLoading(false);
    }
  };
  

  return (
    <Dialog open={openCommentForm} onOpenChange={setOpenCommentForm}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Comment</DialogTitle>
          <DialogDescription>
            Add your comment here. It will be visible to everyone who can see
            this blog.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
           
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your comment here..."
            />
          </div>
          <div className="flex justify-end gap-5">
            <Button variant="outline" onClick={() => setOpenCommentForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}
              disabled={!content.trim() || loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentForm;
