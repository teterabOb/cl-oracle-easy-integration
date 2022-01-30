import { ByMoralis } from "react-moralis";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Account from "components/Account";
import Chains from "components/Chains";
import { Layout } from "antd";
import "antd/dist/antd.dark.css";
import NativeBalance from "components/NativeBalance";
import "./style.css";
import MenuItems from "./components/MenuItems";
import AdminPanel from "components/AdminPanel/AdminPanel";
import Fabric from "components/Fabric/Fabric";
import HowToUseIt from "components/HowToUseIt/HowToUseIt"


const styles = {
  content: {
    display: "flex",
    justifyContent: "center",
    fontFamily: "Roboto, sans-serif",

    marginTop: "130px",
    padding: "10px"

  },
  header: {
    position: "fixed",
    zIndex: 1,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontFamily: "Roboto, sans-serif",
    //borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
    padding: "0 10px",
    backgroundColor: "#141414"
    //boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
  },
  headerRight: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    fontSize: "15px",
    fontWeight: "600",
  },
};
const App = () => {
  return (
    <Layout
      style={{
        height: "100vh",
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#000000"

      }}
    >
      <Router>
        <Layout.Header style={styles.header}>
          <MenuItems />
          <div style={styles.headerRight}>
            <Chains />
            <NativeBalance />
            <Account />
          </div>
        </Layout.Header>

        <div style={styles.content}>
          <Switch>
            <Route exact path="/oraclefabric">
              <Fabric />
            </Route>
            <Route exact path="/adminpanel">
              <AdminPanel />
            </Route>
            <Route exact path="/howtouseit">
              <HowToUseIt />
            </Route>
            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>
        </div>
      </Router>
      <Layout.Footer
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "2rem",
        }}
      >
        <ByMoralis width={300} variant="dark" />

      </Layout.Footer>
    </Layout>
  );
};



export default App;
