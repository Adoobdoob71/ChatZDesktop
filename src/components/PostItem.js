import * as React from "react";
import * as firebase from "firebase";
import { theme } from "../css/Theme";
import { IconButton } from "@material-ui/core";
import { ArrowRight } from "@material-ui/icons";
import { routeNav } from "../redux/routeNavState";

export default class PostItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: null,
    };
    this.Item = props.Item;
  }

  componentDidMount() {
    this.db = firebase.database().ref("users").child(this.Item.userUID);
    this.db.on("value", (snapshot) => {
      this.setState({ userDetails: snapshot.val() });
    });
  }

  componentWillUnmount() {
    this.db.off();
  }

  render() {
    if (this.state.userDetails)
      return (
        <div
          style={{
            borderRadius: 8,
            border: `solid ${theme.placeholderColor}`,
            borderWidth: 1,
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 8,
            paddingBottom: 8,
            display: "flex",
            backgroundColor: theme.cardColor,
            flexDirection: "column",
            marginBottom: 16,
            cursor: "pointer",
          }}
          ref={(ref) => (this.div = ref)}
          onMouseOver={() => (this.div.style.borderColor = theme.primary)}
          onMouseLeave={() =>
            (this.div.style.borderColor = theme.placeholderColor)
          }
          onMouseDown={() =>
            (this.div.style.backgroundColor = theme.cardColorBright)
          }
          onMouseUp={() => (this.div.style.backgroundColor = theme.cardColor)}>
          <div style={{ display: "flex" }}>
            <img
              src={this.Item.groupImage}
              style={{ width: 36, height: 36, borderRadius: 18 }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                marginLeft: 8,
              }}>
              <span style={{ color: theme.textColor, fontSize: 16 }}>
                {this.Item.title}
              </span>
              <span style={{ color: theme.placeholderColor, fontSize: 12 }}>
                {this.Item.groupName}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", marginTop: 12 }}>
            <img
              src={this.Item.imageUrl}
              style={{ width: 64, height: 64, borderRadius: 8 }}
            />
            <span
              style={{
                color: theme.textColor,
                fontSize: 16,
                marginLeft: 8,
                maxLines: 3,
                flex: 1,
              }}>
              {this.Item.body}
            </span>
            <IconButton
              style={{ height: 48, width: 48, alignSelf: "center" }}
              onClick={() =>
                routeNav.dispatch({
                  type: { type: "post", details: null, postDetails: this.Item },
                })
              }>
              <ArrowRight style={{ color: theme.textColor }} />
            </IconButton>
          </div>
          <div style={{ display: "flex", alignItems: "center", marginTop: 12 }}>
            <img
              src={this.state.userDetails.profilePictureUrl}
              style={{ width: 24, height: 24, borderRadius: 12 }}
            />
            <span
              style={{ color: theme.textColor, fontSize: 12, marginLeft: 8 }}>
              Posted By {this.state.userDetails.username}
            </span>
          </div>
        </div>
      );
    else return null;
  }
}
