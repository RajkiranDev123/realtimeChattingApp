import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({children}){
    const navigate=useNavigate()
    useEffect(()=>{
        if(localStorage.getItem("token")){

        }else{
            navigate("/login")
        }
    })
    // useEffect without a dependency array runs every render 

    return(
        <div>
            {children}
        </div>
    )
}

export default ProtectedRoute