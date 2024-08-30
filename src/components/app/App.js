import './App.css';
import {Route, Routes} from "react-router-dom";
import {Login} from "../login/Login";
import {MainSite} from "../mainSite/MainSite";
import {Register} from "../register/Register";
import {Header} from "../header/Header";
import {AdminSite} from "../adminSite/AdminSite";
import {UserProfile} from "../user-profile/UserProfile";
import {Footer} from "../footer/Footer";


function App() {
    return (
        <>
            <Header/>
            <Routes>
                <Route path={"/"} element={<MainSite/>}/>
                <Route path={"/user-profile"} element={<UserProfile/>}/>
                <Route path={"/login"} element={<Login/>}/>
                <Route path={"/register"} element={<Register/>}/>
                <Route path={"/admin"} element={<AdminSite/>}/>
            </Routes>
            <Footer />
        </>
    );
}

export default App;
