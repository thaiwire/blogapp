import LogoutButton from '@/components/functional/logout-button';
import { IUser } from '@/interfaces';
import { getLoggedInUser } from '@/server-actions/users';
import React from 'react'

async function UserDashboardPage() {

  const userResponse = await getLoggedInUser();
  
  if (!userResponse.success) {
    return (<div>
      <p>{userResponse.message}</p>
    </div>
    )
  }
  const user:IUser = userResponse.data;
  return (
    <div className='flex flex-col p-5'>
      <h1>Welcome, {user.name}</h1>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>

      <LogoutButton />
    </div>
  );
}

export default UserDashboardPage