// src/components/Header.js
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import "./Header.css"
import {SideBar} from "../sidebar/SideBar";

export function Header() {
    const [sidebarVisible, setSidebarVisible] = useState(false);

    const toggleSidebar = () => {
        console.log("open")
        console.log("before:", sidebarVisible)
        setSidebarVisible(prevState => !prevState);
        console.log("after", sidebarVisible)
    }
    const closeSidebar = () => {
        setSidebarVisible(false);
    }
    return (
        <>
            <header>
                <nav>
                    <ul>
                        <li><Link to="/"><h1>FEI Art Gallery</h1></Link></li>
                        <li><Link to="/login"><i className="bi bi-person"></i></Link></li>
                        <li onClick={toggleSidebar}><Link to={"#"}><i className="bi bi-list"></i></Link></li>
                        {/* Add more links as needed */}
                    </ul>
                </nav>
            </header>
            <div className={`grey-zone ${sidebarVisible ? 'visible' : ''}`} onClick={closeSidebar}></div>
            <SideBar show={sidebarVisible}/>
        </>
    );
}
