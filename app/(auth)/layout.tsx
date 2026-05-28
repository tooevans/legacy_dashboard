import React from 'react'

const AuthLayout = ({ children } : { children: React.ReactNode}) => {
  return (
    <div className='w-full h-screen flex items-center justify-center'>
        <div className='w-1/2 h-full flex items-center justify-center'> 
            {children} 
        </div>
    </div>
  )
}

export default AuthLayout