import { Outlet } from "react-router-dom";

import { Navigation, Footer} from "../UI";


export const Layout = () => {
    return (
    <div className="layout-container">
    <Navigation/>
          <main className="content">
            <Outlet /> {/* This renders the current route's component */}
          </main>
    <Footer/>
    </div>
  );
}