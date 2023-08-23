import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Form, Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Rating from "../components/Rating";
import { useGetProductDetailsQuery, useCreateReviewMutation } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {addToCart} from '../slices/cartSlice';
import { useDispatch, useSelector } from "react-redux";
import {toast} from "react-toastify";

const ProductScreen = () => {

const { id: productId } = useParams();

const dispatch = useDispatch();
const navigate = useNavigate();
  
const [quantity, setQuantity] = useState(1);
const [rating, setRating] = useState(0);
const [comment, setComment] = useState("");

const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);

const [createReview, { isLoading: loadingReview}] = useCreateReviewMutation();

const { userInfo } = useSelector((state) => state.login)
const addToCartHandler = () => {
  dispatch(addToCart({ ...product, quantity }));
  navigate('/cart');
}

const submitHandler = async (e) => {
  e.preventDefault();

  try {
    await createReview({
      productId,
      rating,
      comment
    }).unwrap();
    refetch();
    toast.success("Review succesfully submitted");
    //set rating and comment back to default afterwards
    setRating(0);
    setComment("");
  } catch (error) {
    toast.error(error?.data?.message || error.error)
  }
}
  return (
    <div>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      { isLoading ? (
        <Loader />
        ) : error ? (
          //danger for red color, success for green color
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <div>
        <Row>
        <Col md={5}>
          <Image src={product.image} alt="product.name" fluid />
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h3>{product.name}</h3>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating  
              value={product.rating} 
              text={`${product.numReviews} reviews`} />
            </ListGroup.Item>
          
          <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
          <ListGroup.Item>
                  Description: {product.description}
                </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${product.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    <strong>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              {product.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Quantity</Col>
                    <Col>
                      <Form.Control
                        as='select'
                        value={quantity}
                        onChange={(e) =>setQuantity(Number(e.target.value))}>
                        {[...Array(product.countInStock).keys()].map((x) => (
                          //so that the quantity numerotation starts with 1
                          <option key={x + 1} value={x + 1}>
                          {x + 1}
                          </option>
                        ))} 
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}
              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={product.countInStock === 0}
                  onClick={addToCartHandler}
                >
                Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <Row className="review">
        <Col md={6}>
          <h2>Reviews</h2>
          {product.reviews.length === 0 && <Message>No Reviews</Message>}
          <ListGroup variant="flush">
            {product.reviews.map(review => (
              <ListGroup.Item key={review._id}>
                <strong>{review.name}</strong>
                <Rating value={review.rating}/>
                <p>{review.createdAt.substring(0, 10)}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}

            <ListGroup.Item>
              <h2>Write a review</h2>
              {loadingReview && <Loader />}
              
              { userInfo ? (
                <Form onSubmit={submitHandler}>
                <Form.Group controlId="rating" className="my-2">
                  <Form.Label>Rating</Form.Label>
                  <Form.Control 
                  as="select" 
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Won't recommend</option>
                    <option value="2">2 - Poor</option>
                    <option value="3">3 - Acceptable</option>
                    <option value="4">4 - Good</option>
                    <option value="5">5 - Excellent</option>
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="comment" className="my-2">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></Form.Control>
                </Form.Group>
                <Button
                disabled={loadingReview}
                  type="submit"
                  variant="primary"
                  >
                  Submit
                </Button>
              </Form>
              ) : (
                <Message>Please <Link to="/login"> log in</Link> to write a review{" "}</Message>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>

      </div>
      )}
      
    </div>
  );
};
  

export default ProductScreen
