import React, { useState } from "react";
import "./App.css";

function App() {
  const [dataList, setDataList] = useState([]);

  const API_URL = "https://qr-backend-stylus.herokuapp.com";
  // const API_URL = "http://localhost:5000";

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const [qrs, setQrs] = useState(null);
  const handleChange = event => {
    setErrors("");
    setDataList(
      event.target.value
        .split(",")
        .map(item => item.trim())
        .map(item => item.replace("/\\/i", ""))
        .filter(item => item !== "")
    );
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    if (!dataList) {
      setErrors("Please enter a list.");
    }

    dataList.forEach(item => {
      if (item.includes("/")) {
        setErrors("Only use alphanumeric, hyphens and underscores.");
      }
    });

    if (errors) {
      setDataList([]);
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/qr`, {
      method: "POST",
      body: JSON.stringify({ data: dataList }), // data can be `string` or {object}!
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        setQrs(data);
        setLoading(false);
      })
      .catch(e => {
        setErrors(
          "Something went wrong. Only use alphanumeric characters, underscores and hyphens."
        );
        setLoading(false);
        setDataList([]);
      });
  };

  const Errors = () => {
    if (!errors) return null;
    return <h4 className="errors">{errors}</h4>;
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
          <p>Enter a list of data, comma separated. Slashes are not allowed.</p>
          <Errors />
          <button submit disabled={loading}>
            {!loading ? "Generate QR Codes" : "Please wait..."}
          </button>
        </form>
        <QRs />
      </div>
    </div>
  );
}

export default App;
