
import userContext from "./UserContext";
import { useState } from "react";

const UserState = (props) => {
  const UsersInitial = [];

  const [Users, setUsers] = useState(UsersInitial);

  // Get Users
  const getUsers = async () => {


    const response = await fetch(`/api/user/fetchallusers`,
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
    setUsers(json.users);


  };

  // Edit a Users
  const editUsers = async (
    id,
    name,
    firstname,
    lastname,
    email,
    location,
    center,
    status,

  ) => {
    // API Call

    const response = await fetch(`/api/user/updateuser/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        name,
        firstname,
        lastname,
        email,
        location,
        center,
        status,
      }),
    });
    const json = await response.json();
    //console.log(json, "UPDATE");
    await getUsers();
  };


  // Delete a Note
  const deleteUser = async (id) => {
    // API Call

    const response = await fetch(`/api/user/deleteUser/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": sessionStorage.getItem("token"),
      },
    });
    const json = response.json();
    getUsers();

  };


  return (
    <userContext.Provider
      value={{
        Users,
        getUsers,
        deleteUser,
        editUsers
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};
export default UserState;
