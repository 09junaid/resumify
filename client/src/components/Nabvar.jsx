import React from "react";
import { Link, useNavigate } from "react-router";

const Nabvar = () => {
  const navigate = useNavigate();
  const user = {
    name: "Junaid Arshad",
  };
  const logoutUser = () => {
    navigate("/");
  };
  return (
    <div className="shadow bg-white">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all">
        <Link to="/" className="flex items-center gap-2">
          <img src="/resumify.svg" alt="logo" width={120} height={120} />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <p className="max-sm:hidden">Hi, {user?.name}</p>
          <button
            onClick={logoutUser}
            className="bg-white hover:bg-slate-50 border border-gray-300 px-7 py-1.5 rounded-full active:scale-95 transition-all"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Nabvar;
