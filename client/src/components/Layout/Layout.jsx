import { Outlet } from "react-router-dom";

import { Navigation, Footer} from "../UI";


export const Layout = () => {
    return (
    <div className="layout-container">
    <Navigation/>
          <main className="content p-4 mx-2 my-4">
            <Outlet /> {/* This renders the current route's component */}
          </main>
    <Footer/>
    </div>
  );
}