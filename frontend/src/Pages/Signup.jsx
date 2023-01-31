import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupThunk } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import { TiTickOutline } from "react-icons/ti";


export default function Signup() {
  const [credential, setCredential] = useState({
    username: "",
    password: "",
  });

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    isAuthenticated && navigate("/");
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredential((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  return (
    <>
      <br />
      <h1 style={{ fontStyle: "italic", fontFamily: 'Times New Roman, serif' }} className="h1card-subtitle text-muted text-center" >Signup</h1>
      <br />


      <div className=" self-align-center d-flex justify-content-center">
        <input
          type="text"
          placeholder="username"
          name="username"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          onChange={handleChange}
        />
        <Button
          variant="dark"
          onClick={() =>
            dispatch(signupThunk(credential)).then(() => navigate("/login"))} >
          <TiTickOutline/>
        </Button>
      </div>
      <br />


      <div className=" self-align-center d-flex justify-content-center">
        <Button
          variant="dark"
          onClick={() => navigate("/login")}>
          Login
        </Button>
      </div>
    </>
  );
}
