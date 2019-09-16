import React, { useState } from "react";
import "./App.css";

function App() {
  const [dataList, setDataList] = useState([]);

  const API_URL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5000"
      : "https://qr-backend-stylus.herokuapp.com";

  const [qrs, setQrs] = useState(null);
  const handleChange = event => {
    setDataList(event.target.value.split(",").map(item => item.trim()));
  };
  const handleSubmit = e => {
    e.preventDefault();
    fetch(`${API_URL}/qr`, {
      method: "POST",
      body: JSON.stringify({ data: dataList }), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => setQrs(data));
  };

  const QRs = () => {
    if (!qrs) return null;

    return qrs.map(qr => {
      return (
        <>
          <img alt={`${qr.split("/").pop()}`} src={`${API_URL}/static/${qr}`} />
          <p>{qr.split(".")[0]}</p>
        </>
      );
    });
  };

  return (
    <div className="App">
      <div className="Input">
        <form onSubmit={handleSubmit}>
          <textarea name="datalist" onChange={handleChange} />
          <p>Enter a list of data, comma separated.</p>
          <button submit>Generate QR Codes</button>
        </form>
        <QRs />
      </div>
    </div>
  );
}

export default App;
