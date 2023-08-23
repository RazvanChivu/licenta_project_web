import {useState} from "react";
import { Form, Button } from "react-bootstrap";
import FormContainer from "../components/FormContainer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate} from "react-router-dom";
import { saveShippingAddress } from "../slices/cartSlice";
import CheckoutProcess from "../components/CheckoutProcess";
const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.adress || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    //call saveShipping address and pass it address, city etc
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    //then navigate to payment page
    navigate('/payment');
  }
  return (
    <FormContainer>
      <CheckoutProcess p1 p2/>

      <h1>Shipping</h1>

      <Form onSubmit={submitHandler}>
        <Form.Group controlId='address' className='my-2'>
          <Form.Label>Address</Form.Label>
          <Form.Control
          type='text'
          placeholder='Enter address'
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          >
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='city' className='my-2'>
          <Form.Label>City</Form.Label>
          <Form.Control
          type='text'
          placeholder='Enter city name'
          value={city}
          onChange={(e) => setCity(e.target.value)}
          >
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='postalCode' className='my-2'>
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
          type='text'
          placeholder='Enter postal code'
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          >
          </Form.Control>
        </Form.Group>
        <Form.Group controlId='country' className='my-2'>
          <Form.Label>Country</Form.Label>
          <Form.Control
          type='text'
          placeholder='Enter country'
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          >
          </Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='my-2'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen;
