import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
  
  const SearchingBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e) => {
    e.preventDefault();
    if(keyword.trim()) {
      setKeyword(""); //clear up the search bar
      navigate(`/search/${keyword}`);
    } else {
      navigate("/");
    }
  }

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search..."
        className="mr-sm-1 ml-sm-4"
      >
      </Form.Control>
      <Button
        type="submit"
        variant="outline-light"
        className="p-1 mx-1"
      >Search</Button>
    </Form>
  )
}

export default SearchingBox