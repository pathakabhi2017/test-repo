import catesContext from "./CatesContext";
import { useState } from "react";

const CatesState = (props) => {

  const catessInitial = [];
  const ActiveCatesInitial = [];
  const [cates, setCates] = useState(catessInitial);
  const [ActiveCates, setActiveCates] = useState(ActiveCatesInitial);
  //const [DeleteCatesRes, setDeleteCatesRes] = useState();
  //const [ResponseMessage, SetResponseMessage] = useState('');


  // Get ques
  const getCates = async () => {

    const response = await fetch(`/api/categories/fetchallcategories`,
      {
        method: "GET",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "auth-token": sessionStorage.getItem("token"),
        },
      }
    );
    const json = await response.json();
    //console.log(json);
    setCates(json.categories);


  };

  // Add a ques
  const addCates = async (
    name,
    status,

  ) => {
    // TODO: API Call
    // API Call
    // console.log(name);
    const response = await fetch(`/api/categories/addcategory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        name,
        status,

      }),
    });

    const cats = await response.json();
    getCates();
    return cats;

  };


  // Edit a Ques
  const editCates = async (
    id,
    name,
    status,

  ) => {
    // API Call
    const response = await fetch(`/api/categories/updatecat/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        name,
        status,
      }),
    });
    const json = await response.json();
    getCates();
    if (json) {
      return json;
    } else {
      return json
    }


    //console.log('abhi')

  };

  // Get ques
  const getActiveCates = async () => {

    const response = await fetch(`/api/categories/fetchcategoriesByStatus`,
      {
        method: "POST",
        headers: {
          "Cache-Control": "no-cache",
          "Content-Type": "application/json",
          "auth-token": sessionStorage.getItem("token"),
        },
        body: JSON.stringify({
          status: 'Active'
        }),
      }
    );
    const json = await response.json();


    setActiveCates(json.categories);


  };


  return (
    <catesContext.Provider
      value={{
        cates,
        ActiveCates,
        //DeleteCatesRes,
        addCates,
        editCates,
        //deleteCates,
        getCates,
        getActiveCates,
        //ResponseMessage,
      }}
    >
      {props.children}
    </catesContext.Provider>
  );
};
export default CatesState;
