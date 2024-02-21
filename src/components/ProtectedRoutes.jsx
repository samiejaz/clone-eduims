import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import RootLayout from "../layout/RootLayout";
import { useContext } from "react";

function ProtectedRoutes() {
  const { user } = useContext(AuthContext);
  return (
    <>
      {user !== null ? (
        <>
          <RootLayout />
        </>
      ) : (
        <>
          <Navigate to={"/auth"} />
        </>
      )}
    </>
  );
}

export default ProtectedRoutes;
