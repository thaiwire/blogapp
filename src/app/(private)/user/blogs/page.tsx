import PageTitle from '@/components/functional/page-title'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function AllBlogsPage() {
  return (
    <div className='flex justify-between items-center'>
      <PageTitle title="My Blogs" />
      <Button>
        <Link href="/user/blogs/add">Create New Blog</Link>
      </Button>
    </div>
  )
}

export default AllBlogsPage