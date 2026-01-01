import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function AuthLayout({
    children,
    authentication = true,
    allowedRoles = []
}) {


    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)

    const authStatus = useSelector(state => state.auth.status)
    const userData = useSelector(state => state.auth.userData)
    
    useEffect(() => {
        // Convert the array to a string for comparison to avoid the "re-render" loop
        const rolesString = JSON.stringify(allowedRoles);

        if (authentication) {
            // 1. If Redux says false AND there's nothing in localStorage, redirect
            if (!authStatus && !localStorage.getItem("userData")) {
                navigate(`/login/${allowedRoles[0] || "admin"}`);
                return;
            }

            // 2. If we have userData, check the roles
            if (userData) {
                const hasPermission = allowedRoles.includes(userData.role);
                if (!hasPermission) {
                    navigate(`/login/${userData.role === 'admin' ? 'admin' : 'student'}`);
                    return;
                }
            }
        }

        setLoader(false);
    }, [authStatus, navigate, authentication, userData, JSON.stringify(allowedRoles)])

    return loader ? <div className="h-screen flex items-center justify-center text-red-600 font-bold">Verifying...</div> : <>{children}</>
}