import { Button } from '@/components/ui/button'
import React from 'react'


function HomePage() {

  return (
    <div className="flex flex-col gap-5 p-5">
      <h1>HomePage</h1>
      <Button className="w-max" variant="default">
        Click me
      </Button>
      <Button className="w-max" variant="destructive">
        Click me
      </Button>
    </div>
  );
}

export default HomePage