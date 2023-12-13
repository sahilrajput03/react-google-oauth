import React from 'react'
import { useStore } from '../hooks/useStore'
import { googleLogout } from '@react-oauth/google'

const Profile = () => {
  const { authData, setAuthData } = useStore()

  const isLoggedIn = authData && authData?.name;

  const handleLogout = () => {
    console.log('googleLogout()?', googleLogout())
    localStorage.setItem('authData', '{}')
    setAuthData({})
  }

  return (
    <div>
      {isLoggedIn && (<>
        <h1>Profile</h1>
        <h3>{authData.name}</h3>
        <h3>{authData.email}</h3>
        <img src={authData.image} />

        <br />

        <button onClick={handleLogout}>Logout</button>
      </>
      )}
    </div>
  )
}

export default Profile