import PageTitle from '@/components/functional/page-title'
import { getAllBlogs } from '@/server-actions/blogs'
import React from 'react'
import Blog from './_component/blogs'

async function AllBlogs() {
  const blogsResponse = await getAllBlogs()
  if (!blogsResponse?.success) {
    return <div className="text-red-500">Failed to load blogs.</div>
  }

  const blogs = blogsResponse.data || []

  return (
    <div>
      <PageTitle title="All Blogs" />
      <div className='flex flex-col gap-5 mt-7'>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  )
}

export default AllBlogs