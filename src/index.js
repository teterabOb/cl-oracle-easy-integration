import { StrictMode } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MoralisProvider } from "react-moralis";
import "./index.css";
import OracleContextProvider from "context/OracleProvider";

/** Get your free Moralis Account https://moralis.io/ */

const APP_ID = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const SERVER_URL = process.env.REACT_APP_MORALIS_SERVER_URL;

const Application = () => {
  return APP_ID && SERVER_URL ? (
    <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
      <OracleContextProvider>
        <App />
      </OracleContextProvider>
    </MoralisProvider>
  ) : (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <App />
    </div>
  );
};

ReactDOM.render(
 
    <Application />,

  document.getElementById("root")
);
