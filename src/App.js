import React from "react";
import Drawer from "./components/Drawer";
import { theme } from "./css/Theme";
import "./App.css";
import "fontsource-roboto";
import PostsFragment from "./fragments/PostsFragment";
import { routeNav } from "./redux/routeNavState";
import ChatFragment from "./fragments/ChatFragment";
import PostScreenFragment from "./fragments/PostScreenFragment";
import { Button, createMuiTheme, ThemeProvider } from "@material-ui/core";
import { Clear, Maximize, Minimize } from "@material-ui/icons";
import { loginState } from "./redux/LoginState";
import LoginFragment from "./fragments/LoginFragment";
import * as firebase from "firebase";
const { autoUpdater } = require("electron-updater");

function isElectron() {
  // Renderer process
  if (
    typeof window !== "undefined" &&
    typeof window.process === "object" &&
    window.process.type === "renderer"
  ) {
    return true;
  }

  // Main process
  if (
    typeof process !== "undefined" &&
    typeof process.versions === "object" &&
    !!process.versions.electron
  ) {
    return true;
  }

  // Detect the user agent when the `nodeIntegration` option is set to true
  if (
    typeof navigator === "object" &&
    typeof navigator.userAgent === "string" &&
    navigator.userAgent.indexOf("Electron") >= 0
  ) {
    return true;
  }

  return false;
}

function App() {
  const [fragmentManagement, setFragmentManagement] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  React.useEffect(() => {
    routeNav.subscribe(() => setFragmentManagement(routeNav.getState().type));
    firebase.auth().onAuthStateChanged((user) => setUser(user));
  }, []);
  const primary = createMuiTheme({
    palette: {
      primary: {
        main: theme.primary,
      },
    },
  });
  const minimize = React.createRef();
  const maximize = React.createRef();
  const clear = React.createRef();
  const updateDiv = React.createRef();
  autoUpdater.on("update-available", () => setUpdateAvailable(true));
  return (
    <ThemeProvider theme={primary}>
      <div
        style={{
          backgroundColor: theme.backgroundColor,
          height: "100vh",
          width: "100vw",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Roboto",
        }}>
        {isElectron() && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: theme.drawerColor,
              alignItems: "center",
              paddingLeft: 8,
            }}
            className="draggingArea">
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ color: theme.placeholderColor, fontSize: 14 }}>
                ChatZ
              </span>
              <Button
                color="primary"
                variant="text"
                size="small"
                className="noDragging"
                style={{ marginLeft: 12 }}
                onClick={() =>
                  user
                    ? firebase.auth().signOut()
                    : loginState.dispatch({ type: true })
                }>
                {user ? "Logout" : "Login"}
              </Button>
            </div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 4,
                }}
                className="noDragging"
                ref={minimize}
                onMouseOver={() =>
                  (minimize.current.style.backgroundColor =
                    theme.cardColorBright)
                }
                onMouseLeave={() =>
                  (minimize.current.style.backgroundColor = "transparent")
                }>
                <Minimize style={{ color: theme.textColor, fontSize: 21 }} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 4,
                }}
                className="noDragging"
                ref={maximize}
                onMouseOver={() =>
                  (maximize.current.style.backgroundColor =
                    theme.cardColorBright)
                }
                onMouseLeave={() =>
                  (maximize.current.style.backgroundColor = "transparent")
                }>
                <Maximize style={{ color: theme.textColor, fontSize: 21 }} />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 4,
                }}
                className="noDragging"
                ref={clear}
                onMouseOver={() =>
                  (clear.current.style.backgroundColor = theme.errorColor)
                }
                onMouseLeave={() =>
                  (clear.current.style.backgroundColor = "transparent")
                }>
                <Clear style={{ color: theme.textColor, fontSize: 21 }} />
              </div>
            </div>
          </div>
        )}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <Drawer />
          <ChatFragment />
          <PostsFragment />
          <PostScreenFragment />
        </div>
      </div>
      <LoginFragment />
      <div
        style={{
          position: "absolute",
          zIndex: 10000,
          padding: 16,
          backgroundColor: theme.drawerColor,
          display: updateAvailable ? "flex" : "none",
          flexDirection: "column",
          bottom: 12,
          right: 12,
        }}
        ref={updateDiv}>
        <span style={{ color: theme.textColor, fontSize: 21 }}>Update!</span>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => (updateDiv.current.style.display = "none")}>
            Remind me later
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => autoUpdater.quitAndInstall()}>
            Update
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
