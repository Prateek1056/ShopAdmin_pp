import { useEffect, useState } from "react";

interface ApiResponse {
  message: string;
  status: boolean;
}

function ApiConnectionTest() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:5029/api/Test")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        return response.json();
      })
      .then((result: ApiResponse) => {
        setData(result);
      })
      .catch((err: Error) => {
        setError(err.message);
      });
  }, []);

  if (error) {
    return <p>Backend connection failed: {error}</p>;
  }

  if (!data) {
    return <p>Connecting to backend...</p>;
  }

  return (
    <div>
      {" "}
      <h3>Backend Connection</h3> <p>{data.message}</p>{" "}
      <p>Status: {data.status ? "Connected" : "Failed"}</p>{" "}
    </div>
  );
}

export default ApiConnectionTest;
