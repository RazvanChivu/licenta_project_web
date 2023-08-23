import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = () => {
  const { userInfo } = useSelector(state => state.login)

  //if userInfo exists i'll put the Outlet, if not then navigate to login
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};

export default PrivateRoute
