import * as React from "react";
import * as firebase from "firebase";
import { theme } from "../css/Theme";

export default class CommentItem extends React.Component {
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

  render() {
    if (this.state.userDetails)
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: 12,
            backgroundColor: theme.cardColorBright,
            borderRadius: 4,
            marginBottom: 16,
          }}>
          <img
            src={this.state.userDetails.profilePictureUrl}
            style={{ width: 36, height: 36, borderRadius: 18, marginRight: 12 }}
          />
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <span style={{ color: theme.textColor, fontSize: 16 }}>
              {this.state.userDetails.username}
            </span>
            <span style={{ color: theme.placeholderColor, fontSize: 12 }}>
              {this.Item.email}
            </span>
            <span style={{ color: theme.textColor, fontSize: 14 }}>
              {this.Item.text}
            </span>
          </div>
        </div>
      );
    else return null;
  }
}
