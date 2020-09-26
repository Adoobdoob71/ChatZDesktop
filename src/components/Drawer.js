import * as React from "react";
import * as firebase from "firebase";
import { ChevronRight, Clear, Menu } from "@material-ui/icons";
import { theme } from "../css/Theme";
import DrawerItem from "./DrawerItem";
import {
  Backdrop,
  Button,
  ButtonBase,
  IconButton,
  TextField,
} from "@material-ui/core";
import { Modal } from "react-bootstrap";
import { loginState } from "../redux/LoginState";

export default class Drawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      userDetails: null,
      contacts: [],
      groups: [],
      drawerOpen: false,
      displayContacts: true,
      displayGroups: true,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ contacts: [] });
        let db = firebase.database().ref("users").child(user.uid);
        db.on("value", (snapshot) => {
          this.setState({ user: user, userDetails: snapshot.val() });
          snapshot.child("private_messages").forEach((item) => {
            this.setState({
              contacts: [...this.state.contacts, item.val()],
            });
          });
        });
      } else this.setState({ user: user, userDetails: null });
    });
  }

  isElectron = () => {
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
  };

  render() {
    if (this.isElectron() && !this.state.userDetails) return null;
    else
      return (
        <div
          style={{
            width: this.state.drawerOpen ? 300 : 72,
            height: "100%",
            backgroundColor: theme.drawerColor,
            display: "flex",
            alignItems: this.state.drawerOpen ? "flex-start" : "center",
            flexDirection: "column",
            transition: ".3s",
          }}>
          <div
            style={{
              display: "flex",
              marginTop: 12,
              justifyContent: this.state.drawerOpen
                ? "space-between"
                : "center",
              alignSelf: "stretch",
              marginRight: this.state.drawerOpen ? 12 : 0,
              marginBottom: this.state.drawerOpen ? 0 : 12,
              marginLeft: this.state.drawerOpen ? 12 : 0,
            }}>
            <IconButton
              onClick={() =>
                this.setState({ drawerOpen: !this.state.drawerOpen })
              }
              style={{
                padding: 8,
              }}>
              <Menu style={{ color: theme.textColor }} />
            </IconButton>
            {this.state.drawerOpen && !this.isElectron() && (
              <Button
                onClick={() =>
                  this.state.user
                    ? firebase.auth().signOut()
                    : loginState.dispatch({ type: true })
                }
                color="primary"
                variant="text">
                {this.state.user ? "Logout" : "Login"}
              </Button>
            )}
          </div>
          {this.state.userDetails && (
            <>
              <ButtonBase
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: 12,
                  marginTop: 8,
                  alignSelf: "stretch",
                  justifyContent: "flex-start",
                }}>
                <img
                  src={this.state.userDetails.profilePictureUrl}
                  style={{
                    width: this.state.drawerOpen ? 72 : 48,
                    height: this.state.drawerOpen ? 72 : 48,
                    borderRadius: 8,
                    transition: ".3s",
                  }}
                />

                {this.state.drawerOpen && (
                  <div
                    style={{
                      flexDirection: "column",
                      display: "flex",
                      flex: 1,
                      marginLeft: 12,
                      justifySelf: "flex-start",
                    }}>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: theme.textColor,
                      }}>
                      {this.state.userDetails.username}
                    </span>
                    <span
                      style={{ fontSize: 14, color: theme.placeholderColor }}>
                      {this.state.user.email}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        color: theme.textColor,
                        marginTop: 8,
                      }}>
                      {this.state.userDetails.description}
                    </span>
                  </div>
                )}
              </ButtonBase>
              <ButtonBase
                style={{
                  display: "flex",
                  padding: 12,
                  width: this.state.drawerOpen ? 300 : undefined,
                  justifyContent: "flex-start",
                  marginBottom: 8,
                }}
                onClick={() =>
                  this.setState({
                    displayContacts: !this.state.displayContacts,
                  })
                }>
                {this.state.drawerOpen && (
                  <span
                    style={{
                      fontSize: 16,
                      color: theme.textColor,
                      fontWeight: "bold",
                    }}>
                    Contacts
                  </span>
                )}
                <ChevronRight
                  style={{
                    marginLeft: "auto",
                    color: theme.textColor,
                    transform: `rotate(${
                      this.state.displayContacts ? -90 : 90
                    }deg)`,
                    transition: ".3s",
                  }}
                />
              </ButtonBase>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: this.state.displayContacts ? "100%" : 0,
                  transition: ".3s",
                  overflowY: "auto",
                }}>
                {this.state.contacts.map((item) => (
                  <DrawerItem Item={item} drawerOpen={this.state.drawerOpen} />
                ))}
              </div>
            </>
          )}
        </div>
      );
  }
}
