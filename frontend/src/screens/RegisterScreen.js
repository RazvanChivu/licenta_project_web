import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { setCredentials } from "../slices/loginSlice";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  
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
  }, [navigate, redirect, userInfo]);


  //unrwap is to extract the resolved value from the promise
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password  !== confirmPassword) {
      toast.error('Passwords are not matching');
      return;
    } else {
      try {
        //call register
        const res = await register({ name, email, password }).unwrap();
        //dispatch the credentials to setCredentials in loginSlice 
        //and it will set the localStorage to the user
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      } 
    }
  };

  return (
    <FormContainer>
      <h1>Register</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='name' className='my-3'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            placeholder='Your Name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            >
            </Form.Control>
        </Form.Group>
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

        <Form.Group controlId='confirmPassword' className='my-3'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            >
            </Form.Control>
        </Form.Group>

        <Button disabled={isLoading} type='submit' variant='primary' className='my-2' >
          Register
        </Button>

        {isLoading && <Loader />}
      </Form>

      <Row className='py-3'>
        <Col>
           Already registered?{' '}<Link to={ redirect ? `/login?redirect=${redirect}` : '/login'}>Sign in</Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
