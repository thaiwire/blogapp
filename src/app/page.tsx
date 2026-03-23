import { Button } from '@/components/ui/button'
import React from 'react'


function HomePage() {
  return (
    <div className='flex flex-col gap-5 p-5'> 
      <h1>HomePage</h1>
      <Button className='w-max' variant="default">Hello World</Button>
      <Button className='w-max' variant="outline">Hello World</Button>

      
    </div>
  );
}

export default HomePage