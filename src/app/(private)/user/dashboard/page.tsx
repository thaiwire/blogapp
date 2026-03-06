import LogoutButton from '@/components/functional/logout-btn';
import { IUser } from '@/interface';
import { getLoggedInUser } from '@/server-actions/users'
import React from 'react'

async function UserDashboardPage() {
  const userResponse = await getLoggedInUser();
  if (!userResponse.success) {
    return (
      <div>Error: {userResponse.message}</div>
    );
  }
  const user:IUser = userResponse.data;
  
  return (
    <div className="p-5">
      <h1>User Dashboard</h1>
      <h1>User Id :{user.id}</h1>
      <h1>User Name :{user.name}</h1>
      <h1>User Email:{user.email}</h1>
      <LogoutButton />
    </div>
  );
}

export default UserDashboardPage