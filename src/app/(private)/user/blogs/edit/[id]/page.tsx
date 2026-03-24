import PageTitle from '@/components/functional/page-title'
import React from 'react'
import BlogForm from '../../_common/blog-form'

function EditBlogPage() {
  return (
    <div>
        <PageTitle title='Edit Blog' />
        <BlogForm formType="edit" />
    </div>
  )
}

export default EditBlogPage