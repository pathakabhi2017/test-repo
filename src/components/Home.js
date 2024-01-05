import React from "react";

import Questions from "./Questions";

const Home = (props) => {
  const { showAlert } = props;
  return (
    <div>
      <Questions showAlert={showAlert} />
    </div>
  );
};

export default Home;
