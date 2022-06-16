import "./App.css";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Dropdown } from "primereact/dropdown";
import React, { useState } from "react";
import usePrevious from "./hooks/UsePrevious";

import "primereact/resources/themes/lara-light-indigo/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons

const client = new W3CWebSocket("wss://wssx.gntapi.com:443");

client.onopen = () => {
  client.send("prices");
};

function App() {
  let [options, setOptions] = useState(null);
  let [selectedOption, setSelectedOption] = useState(null);
  let [bid, setBid] = useState(null);
  let [ask, setAsk] = useState(null);
  let prevBid = usePrevious(bid);
  let prevAsk = usePrevious(ask);
  client.onmessage = ({ data }) => {
    const ServerResponse = JSON.parse(data);
    if (!options) {
      const result = Object.keys(ServerResponse.prices).map((price) => {
        return {
          name: price,
          value: price,
        };
      });
      setOptions(result);
    }

    if (selectedOption) {
      GetSelectionData(ServerResponse);
    }
  };

  const GetSelectionData = ({ prices }) => {
    setBid(prices[selectedOption].bid);
    setAsk(prices[selectedOption].ask);
  };

  return (
    <div className="App">
      <div className="row mb-5">
        <h1>Visualizador de precios GNT</h1>
      </div>
      <div className="d-flex justify-content-center w-100 mb-5">
        <Dropdown
          optionLabel="name"
          optionValue="value"
          onChange={(e) => setSelectedOption(e.value)}
          options={options}
          value={selectedOption}
          placeholder="Selecciona una divisa"
        />
      </div>
      <div className="row">
        <div className="col">
          <h1>Bid:</h1>
          <h1
            style={{
              color: prevBid < bid ? "green" : "red",
            }}
          >
            {bid}
          </h1>
        </div>
        <div className="col">
          <h1>Ask:</h1>
          <h1
            style={{
              color: prevAsk < ask ? "green" : "red",
            }}
          >
            {ask}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default App;
