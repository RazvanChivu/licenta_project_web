import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/loginSlice";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.login);
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get('redirect') || '/'

  //check if we're logged in
  useEffect(() => {
    //if there is userInfo in localStorage
    //navigate to what the redirect is
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);


  //unrwap is to extract the resolved value from the promise
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      //call login
      const res = await login({ email, password }).unwrap();
      //dispatch the credentials to setCredentials in loginSlice 
      //and it will set the localStorage to the user
      dispatch(setCredentials({...res, }));
      navigate(redirect)
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email' className='my-3'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Email Address'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            >
            </Form.Control>
        </Form.Group>

        <Form.Group controlId='password' className='my-3'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            >
            </Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='my-2' disabled= {isLoading}>
          Login
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
           New here? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Create new account</Link>
        </Col>
      </Row>
    </FormContainer>
  )
}

export default LoginScreen;
