
import Webcamcomp from "./components/Webcamcomp";

function App() {

  return (
  <>
    <main className="bg-gray-800">
      <div className = "justify-center items-center flex border-b-3 border-dotted pb-4 pt-4 border-white font-mono">
        <h1 className = "text-5xl text-white">Facial Recognition</h1>
      </div>
      <Webcamcomp></Webcamcomp>
    </main>
  </>
  )
}

export default App;