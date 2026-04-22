import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { getStatus } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import type { StatusResponse } from "../../types/authTypes";

function ProtectedRoute({ allowedRoles, children }: { allowedRoles: StatusResponse["role"][], children: ReactNode }){
    const [ready, setReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getStatus().then(status => {
            console.log('ProtectedRoute: Status received:', status);
            console.log('ProtectedRoute: Allowed roles:', allowedRoles);
            console.log('ProtectedRoute: Role included?', allowedRoles.includes(status.role));
            
            if (!allowedRoles.includes(status.role)){
                console.log('ProtectedRoute: Access denied, redirecting to login');
                switch (status.role) {
                    case "NONE": 
                        navigate("/login"); 
                        break;
                    case "FAMILY":
                        navigate("/login");
                        break;
                    case "SYSADMIN":
                        navigate("/login");
                        break;
                    case "USER":
                        navigate("/login");
                        break;
                }
            } else {
                console.log('ProtectedRoute: Access granted');
                setReady(true);
            }
        })
        .catch(err => {
            console.error('ProtectedRoute: Error getting status:', err);
            navigate("/login");
        })
    }, [])


    if (!ready) return null;

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute;
