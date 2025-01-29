import React, { Suspense } from "react";
import ShopNavbar from "../components/Shop/Layout/ShopNavbar";

const generalNotFoundThankPage = () => {
  return (
    <React.Fragment>
      <Suspense fallback={<div>Loading ... </div>}>
        <div className="w-full">
          <ShopNavbar />
        </div>
        <div className="flex flex-col justify-center items-center py-10 h-screen">
          <div>
            <i className="fa-solid fa-circle-check text-4xl text-green-800 py-1"></i>
          </div>
          <div className="flex flex-col justify-center items-center text-2xl font-bold py-1">
            Thank for trying :)
          </div>

          <p>
            <a href="/" className="text-lg">
              Back Home
            </a>
          </p>
        </div>
      </Suspense>
    </React.Fragment>
  );
};

export default generalNotFoundThankPage;
