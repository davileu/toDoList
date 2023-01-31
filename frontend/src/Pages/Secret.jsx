import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "../redux/authSlice";
import { showtodoThunk, addtodoThunk, deletetodoThunk, edittodoThunk } from "../redux/todoSlice";
import Fade from 'react-bootstrap/Fade'
import Button from 'react-bootstrap/Button';
import { BsPencil } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";

export default function Secret() {
  const showtodo = useSelector((state) => state.todoReducer.showtodo[0]);
  const dispatch = useDispatch();

  const [addList, setAddList] = useState({
    list: ""
  });

  const [editList, setEditList] = useState({
    edit: ""
  })

  const [searchList, setSearchList] = useState("")

  useEffect(() => {
    dispatch(showtodoThunk());
  }, [addtodoThunk]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setAddList((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditList((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
    console.log(editList);
  };

  const handleRemoveList = (event) => {
    console.log(event.target.id);
    dispatch(deletetodoThunk({ id: event.target.id }));
    document.getElementById(event.target.id).style.textDecoration = 'line-through'
  }

  const handleEditList = (event) => {
    if (event.target.localName == "svg") {
      // console.log(event.target.attributes[1].nodeValue)
      dispatch(edittodoThunk({ id: event.target.attributes[4].nodeValue, edit: editList.edit }));
      console.log(event.target.attributes[4].nodeValue)
    } else {
      dispatch(edittodoThunk({ id: event.target.nearestViewportElement.nextSibling.id, edit: editList.edit }));
      console.log(event.target.nearestViewportElement.nextSibling.id)
    }
    document.getElementById("updateBox").value ="";
  }

  const handleSearchChange = (event) => {
    let searchList = event.target.value
    setSearchList(searchList);
  }

  return (
    <div style={{ border: "soild 2px black", padding: "11px" }}>

      {/* Welcoming */}
      <Fade in={true} appear={true} timeout={100000}>
        <h1 style={{ fontStyle: "italic", fontFamily: 'Times New Roman, serif' }} className="h1card-subtitle text-muted text-center" >To do List</h1>
      </Fade>
      <br />
      <p className="form-control" aria-label="Text input with segmented dropdown button"> Welcome! You have logged in successfully.</p>
      <br />


      {/* Search field */}
      <div className="row">
        <div className="input-group">
          <Button variant="dark">
            <BsSearch />
          </Button>
          <input type="text" name="search" placeholder="Search something here ..." onChange={handleSearchChange} className="form-control" aria-label="Text input with segmented dropdown button"></input>
          <div className="input-group-append">
          </div>
        </div>
      </div>
      <br />


      {/* Add field */}
      <div >
        <div className="input-group">
          <input id="addBox" type="text" name="list" placeholder="add something here ..." onChange={handleChange} className="form-control" aria-label="Text input with segmented dropdown button"></input>
          <div className="input-group-append">
            <Button onClick={() => dispatch(addtodoThunk(addList))} variant="dark">
              add
            </Button>
          </div>
        </div>
      </div>
      <br />


      {/* Explanation */}
      <p className="mb-2 text-muted text-center" style={{ textDecoration: 'underline', fontSize: '16px', fontFamily: 'Courier New, monospace' }}>Click the text to delete
        <br /> Type sth and click the pen to update</p>


      {/* To do list */}
      {showtodo && showtodo
        .filter((element) => {
          if (searchList === "") {
            return element;
          } else if (
            element.list.toLowerCase().includes(searchList.toLowerCase())
          ) {
            return element;
          } else {
            return undefined;
          }
        })

        .map((element, index) => (
          < >
            <div
              style={{ display: "flex", margin: "4px", padding: "13px", border: "solid", borderRadius: '11px' }}>
              <p key={index} id={element.id} onClick={handleRemoveList}>
                {element.list}
              </p>
              <BsPencil
                penid={element.id}
                style={{ border: "solid black 1px", margin: "5px" }}
                onClick={handleEditList}
              />
            </div>
          </>
        ))}


      {/* Edit box */}
      <div style={{ marginTop: "10px" }} >
        <input id="updateBox" style={{ float: 'right', clear: 'both', marginRight: "4px", width: "50%", border: "solid" }} type="text" name="edit" placeholder="edit something here ..." onChange={handleEditChange} className="form-control"></input>
      </div>
      <br />


      {/* Logout Btn */}
      <Button style={{ position: "relative", float: "left" }} variant="dark" onClick={() => dispatch(logoutThunk())}>Logout</Button>


    </div>
  );
}
