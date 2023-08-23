import { Row, Col, Form, Button } from 'react-bootstrap';
import Product from '../components/Product';
import { useGetProductsQuery, useGetFilteredProductsQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useParams } from 'react-router-dom'
import Paginate from '../components/Paginate';
import { Link } from 'react-router-dom';
import ProductSlider from '../components/ProductSlider';
import { useState, useEffect } from 'react';
const HomeScreen = () => {

  //because pageNumber is a param in productsApiSlice
  const { pageNumber, keyword } = useParams();

  //data includes products, the page and page size
  const { data: allProductsData, isLoading: isLoadingAllProducts, error: allProductsError, refetch: refetchAllProducts } = useGetProductsQuery({ keyword, pageNumber });

  const [gender, setGender] = useState('');
  const [type, setType] = useState('');

  const { data: filteredProductsData, isLoading: isLoadingFilteredProducts, error: filteredProductsError, refetch: refetchFilteredProducts } = useGetFilteredProductsQuery({ gender, type });

  //  Determine which data to be displayed based if filter selection has been changed
  const displayData = gender || type ? filteredProductsData : allProductsData;
  const isLoading = isLoadingAllProducts || isLoadingFilteredProducts;
  const error = allProductsError || filteredProductsError;

  useEffect(() => {
    if (gender !== "" || type !== "") {
      //  Fetch the filtered products when gender or type changes
      refetchFilteredProducts();
    }
    else {
      refetchAllProducts();
    }
  }, [gender, type, refetchFilteredProducts, refetchAllProducts]);

  // clear the filters and refetch all the products by performing the above useEffect else condition
  const clearFilters = () => {
    setGender('')
    setType('')
  }

  return (
    
    //keyword meand we're looking at search results, so if its not keyword then show the slider
    <div>
      {!keyword ? <ProductSlider /> : (<Link to="/" className="btn btn-light mb-4">Go Back</Link>)}
      { isLoading ? (
        <Loader />
      ) : error ? 
      (<Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (<div>
      <h1>Latest Products</h1>

      <Row className='mb-3 align-items-center'>
        <Col sm={6} md={4} lg={3}>
          <Form.Group controlId='gender'>
            <Form.Label>Gender</Form.Label>
            <Form.Select value={gender} onChange={e => setGender(e.target.value)}>
              <option value="" disabled>Select product gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col sm={6} md={4} lg={3}>
          <Form.Group controlId='type'>
            <Form.Label>Category</Form.Label>
            <Form.Select value={type} onChange={e => setType(e.target.value)}>
              <option value="" disabled>Select product category</option>
              <option value="Shirts">Shirts</option>
              <option value="Pants">Pants</option>
              <option value="Rollerblades">Rollerblades</option>
              <option value="Helmets">Helmets</option>
              <option value="Snowboard">Snowboard</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col>
          <Button type="submit" variant="primary" onClick={clearFilters}>Clear </Button>
        </Col>

      </Row>


      <Row>
        { displayData.products && displayData.products.length > 0 ? (
            displayData.products.map((product) =>(
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))
          ) : <Message variant='info'>No products</Message>
        }
      </Row>
      <Paginate
        pages={displayData.pages}
        page={displayData.page} 
        keyword={keyword ? keyword : ""}
      />
        </div>)}
    </div>
  )
};

export default HomeScreen;
