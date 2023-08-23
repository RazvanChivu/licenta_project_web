import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button} from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { 
  useUpdateProductMutation, 
  useGetProductDetailsQuery, 
  useUploadProductImageMutation, 
} from "../slices/productsApiSlice";
import { toast } from "react-toastify";
import FormContainer from "../components/FormContainer";


const ProductEditScreen = () => {
  const { id: productId } = useParams();
  //fetching the product
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [price, setPrice] = useState(0);
  const [brand, setBrand] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  //the product's data
  const { data: product, isLoading, refetch, error, } = useGetProductDetailsQuery(productId);
  
  const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload}] = useUploadProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    //if there is a product it'll set the state field to the fields that are in the product data
    if(product) {
      setName(product.name);
      setGender(product.gender);
      setPrice(product.price);
      setBrand(product.brand);
      setImage(product.image);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
   }, [product]);  

   const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct ({
        productId,
        name,
        gender,
        price,
        brand,
        countInStock,
        image,
        category,
        description,
      });
      toast.success("Product updated successfully");
      refetch();
      navigate("/admin/productlisting");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
   };

   const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
   }
  return (
    <div>
      <Link to="/admin/productlisting" className="btn btn-light my-3">
      Go Back</Link>
      <FormContainer>
        <h1> Edit Product</h1>
        {loadingUpdate && <Loader />}

        {isLoading ? <Loader /> : error ? <Message variant="danger">
        {error}</Message> : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className='my-2'>
              <Form.Label>Name</Form.Label>
              <Form.Control 
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="gender" className='my-2'>
              <Form.Label>Gender</Form.Label>
              <Form.Select value={gender} onChange={e => setGender(e.target.value)}>
                <option value="Gender" disabled>Select product gender</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Kids">Kids</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="price" className='my-2'>
              <Form.Label>Price</Form.Label>
              <Form.Control 
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="brand" className='my-2'>
              <Form.Label>Brand</Form.Label>
              <Form.Control 
              type="text"
              placeholder="Enter brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}>
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="CountInStock" className='my-2'>
              <Form.Label>Stock</Form.Label>
              <Form.Control 
              type="number"
              placeholder="Enter stock"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}>
              </Form.Control>
            </Form.Group>
            
            <Form.Group controlId="category" className='my-2'>
              <Form.Label>Category</Form.Label>
              <Form.Select value={category} onChange={e => setCategory(e.target.value)}>
                <option value="" disabled>Select product category</option>
                <option value="Shirts">Shirts</option>
                <option value="Pants">Pants</option>
                <option value="Rollerblades">Rollerblades</option>
                <option value="Helmets">Helmets</option>
                <option value="Snowboard">Snowboard</option>
              </Form.Select>
            </Form.Group>

            <Form.Group controlId="image" className="my-2">
              <Form.Label>Image</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage}></Form.Control>
                <Form.Control
                type="file"
                label="Choose file"
                onChange={uploadFileHandler}></Form.Control>
            </Form.Group>

            <Form.Group controlId="Description" className='my-2'>
              <Form.Label>Description</Form.Label>
              <Form.Control 
              type="text"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}>
              </Form.Control>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              className="my-2">Update</Button>
          </Form>
        )}
        
      </FormContainer>
    </div>
  );
};

export default ProductEditScreen;
