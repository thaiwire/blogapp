import PageTitle from "@/components/functional/page-title";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

function AllBlogPage() {
  return (
    <div className="flex justify-between items-center">
      <PageTitle title="All Blogs" />
      <Button variant="default" size="sm">
        <Link href="/user/blogs/add">Add Blog</Link>
      </Button>
    </div>
  );
}

export default AllBlogPage;
