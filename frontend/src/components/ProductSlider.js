import { Link } from "react-router-dom";
import Loader from "./Loader";
import Message from "./Message";
import { Image, Carousel } from "react-bootstrap";
import { useGetBestProductsQuery } from "../slices/productsApiSlice";


const ProductSlider = () => {
  const { data: products, isLoading, error } = useGetBestProductsQuery()


  return isLoading ? <Loader /> : error ? <Message variant="danger">{error}</Message> : (
    <Carousel pause="hover" className="bg-primary mb-3" style={{ width: "100%", display: "block", margin: "auto" }}>
      {products.map(product => (
        <Carousel.Item key={product._id}>
          <Link to={`/product/${product._id}`}>
            <Image src={product.image} alt={product.name} fluid style={{ width: "40%", display: "block", margin: "auto" }}/>
            <Carousel.Caption className="carousel-caption">
              <h2>
                {product.name} (${product.price})
              </h2>
            </Carousel.Caption>
          </Link>

        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default ProductSlider
