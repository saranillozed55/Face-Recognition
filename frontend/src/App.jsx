
import Webcamcomp from "./components/Webcamcomp";

function App() {

  // MOVE THIS TO A COMPONENT - WILL JUST BE A BUTTON TO START RUNNING THE FACE RECOGI

  // const API_URL = 'http://localhost:8000/api/start-button'

  // const handleSubmit = async (event) => {
  //   try{

  //     event.preventDefault()

  //     const response = await fetch(API_URL, {
  //       method: 'POST'
  //     });

  //     // just send response to log for now in frontend
  //     const data = await response.json();
  //     console.log(data.message);
  //   }
  //   catch (error) {
  //     console.error('Error sending item:', error)
  //   }
  // };

  return (
  <>
    {/* <form onSubmit ={handleSubmit}>
      <button><strong>Start!</strong></button>
    </form> */}
    
    <Webcamcomp></Webcamcomp>
  </>
  )
}

export default App;