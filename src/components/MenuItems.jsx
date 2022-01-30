import { useLocation } from "react-router";
import { Menu } from "antd";
import { NavLink } from "react-router-dom";

function MenuItems() {
  const { pathname } = useLocation();

  return (
    <Menu
      theme="light"
      mode="horizontal"
      style={{
        display: "flex",
        fontSize: "17px",
        fontWeight: "500",
        width: "100%",
        justifyContent: "center",
      }}
      defaultSelectedKeys={[pathname]}
    >
      <Menu.Item key="/oraclefabric">
        <NavLink to="/oraclefabric">🏦 Oracle Fabric</NavLink>
      </Menu.Item>
      <Menu.Item key="/adminpanel">
        <NavLink to="/adminpanel">📚 Admin Panel</NavLink>
      </Menu.Item>
      <Menu.Item key="/howtouseit">
        <NavLink to="/howtouseit">🧿 How to use it</NavLink>
      </Menu.Item>
    </Menu>
  );
}

export default MenuItems;
