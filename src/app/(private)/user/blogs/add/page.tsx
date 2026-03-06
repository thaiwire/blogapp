import PageTitle from '@/components/functional/page-title'
import React from 'react'
import BlogForm from '../_common/blog-form'

function AddBlogPage() {
  return (
    <div>
      <PageTitle title="Add new Blog" />
      <BlogForm />
    </div>
  )
}

export default AddBlogPage