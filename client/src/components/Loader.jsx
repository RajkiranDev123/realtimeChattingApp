import React from 'react'
import "./loader.css"

const Loader = () => {
    return (
        <div style={{
            display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw", background: "grey",
            opacity: "0.1", zIndex: 2, position: "absolute"
        }}>
            <div className='loader' style={{zIndex:3}}></div>
        </div>
    )
}

export default Loader