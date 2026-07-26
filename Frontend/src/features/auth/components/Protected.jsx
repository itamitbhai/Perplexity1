import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import Logo from '../../../components/Logo'


const Protected = ({ children }) => {
    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    if(loading){
        return (
            <div className="flex h-dvh w-full items-center justify-center bg-[#07090f]">
                <div className="animate-pulse">
                    <Logo size={48} />
                </div>
            </div>
        )
    }

    if(!user){
        return <Navigate to="/login" replace/>
    }


  return children
}

export default Protected
