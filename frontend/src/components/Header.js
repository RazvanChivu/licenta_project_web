import { Container, Badge, Navbar, NavDropdown, Nav } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from "../slices/loginSlice";
import { LinkContainer } from 'react-router-bootstrap';
import { useNavigate } from 'react-router-dom';
import SearchingBox from "./SearchingBox";

//LinkContainer este folosit pentru a nu face render la o pagina noua

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [performLogout] = useLogoutMutation();

  //logout and redirects to the login page
  const logoutHandler = async () => {
    //performLogoutfunction returns a promise 
    //and unwrap() is used to extract the resolved value from the promise
    try {
      await performLogout().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <header>
      <Navbar bg="primary" variant="primary" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
          <Navbar.Brand className="text-white">
            SportShop
          </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basiv-navbar-nav">
            <Nav className="ms-auto">
              <SearchingBox />
              <LinkContainer to="/cart">
                <Nav.Link className="text-white">
                  <FaShoppingCart /> Cart
                  {
                    cartItems.length > 0 && (
                      <Badge pill bg='success' 
                      style={{marginLeft: '4px'}}>
                        { cartItems.reduce((a, c) => a + c.quantity, 0) }
                      </Badge>
                    )
                  }
                </Nav.Link>
              </LinkContainer>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item >Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
              <LinkContainer to="/login">
              <Nav.Link href='/login' className="text-white"><FaUser /> Log in</Nav.Link>
              </LinkContainer>
              )}
              
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin" id="menuadmin">
                  <LinkContainer to="/admin/userlisting">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/productlisting">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlisting">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  )
}

export default Header
