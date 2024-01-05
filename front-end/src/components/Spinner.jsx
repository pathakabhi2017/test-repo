import React from "react";


const Spinner = () => {

  return (
    <div className="spinner_outer">
      <div className="spinner-border text-warning " role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
  // return (
  // <>

  {/* {online ? ( */ }

  {/* // ) : (<> */ }
  {/* <div className="network-gif">
          <img src="/images/animation.gif" alt="" />
          <div className="test-msg">Test process for this website  </div>
        </div> */}
  {/* </>) */ }
}


// </>
//   );
// };

export default Spinner;
