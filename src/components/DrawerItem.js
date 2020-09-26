import * as React from "react";
import { theme } from "../css/Theme";
import * as firebase from "firebase";
import { ButtonBase } from "@material-ui/core";
import { routeNav } from "../redux/routeNavState";

export default class DrawerItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: null,
      active: false,
    };
    this.Item = props.Item;
  }

  componentDidMount() {
    this.db = firebase.database().ref("users").child(this.Item.userUID);
    this.db.on("value", (snapshot) => {
      this.setState({ userDetails: snapshot.val() });
    });
    routeNav.subscribe(() => {
      if (routeNav.getState().type === "chat")
        this.setState({
          active: routeNav.getState().details.userUID === this.Item.userUID,
        });
      else this.setState({ active: false });
    });
  }

  changeView = () => {
    routeNav.dispatch({
      type: this.state.active
        ? { type: null, details: null }
        : { type: "chat", details: this.Item },
    });
  };

  render() {
    if (this.state.userDetails)
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 8,
            paddingBottom: 8,
            backgroundColor: this.state.active
              ? theme.cardColor
              : "transparent",
            transition: ".2s",
            cursor: "pointer",
          }}
          ref={(ref) => (this.mainDiv = ref)}
          onClick={this.changeView}
          onMouseOver={() => (this.profileImage.style.borderRadius = 8)}
          onMouseLeave={() => (this.profileImage.style.borderRadius = 24)}>
          <div
            style={{
              borderRadius: this.state.active ? 8 : 24,
              borderWidth: this.state.active ? 1 : 0,
              borderColor: theme.textColor,
              transition: ".3s",
              justifyContent: "start",
            }}>
            <img
              ref={(ref) => (this.profileImage = ref)}
              src={this.state.userDetails.profilePictureUrl}
              style={{
                width: 48,
                height: 48,
                border: "solid transparent",
                borderWidth: 0,
                borderRadius: this.state.active ? 8 : 24,
                transition: ".3s",
              }}
            />
          </div>
          {this.props.drawerOpen && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                marginLeft: 12,
              }}>
              <span
                style={{
                  fontSize: 16,
                  color: theme.textColor,
                  marginBottom: 4,
                }}>
                {this.state.userDetails.username}
              </span>
              <span style={{ fontSize: 12, color: theme.placeholderColor }}>
                {this.state.userDetails.description}
              </span>
            </div>
          )}
        </div>
      );
    else return null;
  }
}
