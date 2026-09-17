import { useState } from "react";

function App() {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/process-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Backend response:", data);
      setResponse(data);
    } catch (err) {
      console.error("Error connecting to backend:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Facial Recognition Pipeline Test</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
      />

      {loading && <p>Sending to backend...</p>}

      {response && (
        <pre className="bg-gray-800 p-4 rounded w-full max-w-md overflow-auto text-sm">
          {JSON.stringify(response, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;