import * as React from "react";
import * as firebase from "firebase";
import { theme } from "../css/Theme";
import { Check, Clear, Edit } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

export default class MessageItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetails: null,
      editButtonVisible: false,
      editMessageText: props.Item.text,
      editing: false,
      edited: props.Item.edited,
    };
    this.Item = props.Item;
  }

  componentDidMount() {
    this.db = firebase.database().ref("users").child(this.Item.userUID);
    this.db.on("value", (snapshot) => {
      this.setState({ userDetails: snapshot.val() });
    });
  }

  editMessage = async () => {
    await firebase
      .database()
      .ref("private_messages")
      .child(this.props.details.private_messages_ID)
      .child(this.Item.key)
      .update({
        text: this.state.editMessageText,
        edited: true,
      });
    this.setState({ editing: false, edited: true });
  };

  render() {
    if (this.state.userDetails)
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: 8,
            padding: 12,
            width: "100%",
            backgroundColor: "transparent",
          }}
          ref={(ref) => (this.itemDiv = ref)}
          onMouseOver={() => {
            this.itemDiv.style.backgroundColor = theme.OnHoverColor;
            this.setState({ editButtonVisible: true });
          }}
          onMouseLeave={() => {
            this.itemDiv.style.backgroundColor = "transparent";
            this.setState({ editButtonVisible: false });
          }}>
          <img
            src={this.state.userDetails.profilePictureUrl}
            style={{ width: 48, height: 48, borderRadius: 24 }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 12,
              flex: 1,
            }}>
            <span
              style={{
                color: theme.textColor,
                fontSize: 16,
                fontWeight: "600",
              }}>
              {this.state.userDetails.username}
            </span>
            <img
              src={this.Item.imageUrl}
              style={{
                marginTop: 8,
                borderRadius: 8,
                maxWidth: 300,
                display: this.Item.imageUrl != undefined ? "flex" : "none",
              }}
            />
            {this.state.editing ? (
              <input
                type="text"
                style={{
                  background: theme.textBoxBrightColor,
                  color: theme.textColor,
                  width: 550,
                  outline: "none",
                  border: "none",
                  padding: 8,
                  marginTop: 12,
                }}
                value={this.state.editMessageText}
                onChange={(event) =>
                  this.setState({ editMessageText: event.currentTarget.value })
                }
                ref={(ref) => (this.textInput = ref)}
              />
            ) : (
              <div
                style={{
                  marginTop: 12,
                  width: 550,
                  display: "flex",
                  flexDirection: "column",
                }}>
                <span
                  style={{
                    color: theme.textColor,
                    fontSize: 15,
                    display: "inline-block",
                    overflowWrap: "break-word",
                  }}>
                  {this.state.editMessageText}
                </span>
                <span
                  style={{
                    marginTop: 2,
                    color: theme.placeholderColor,
                    fontSize: 10,
                    display: this.state.edited ? "flex" : "none",
                  }}>
                  (edited)
                </span>
              </div>
            )}
          </div>
          {this.state.editing ? (
            <div style={{ display: "flex", marginRight: 16 }}>
              <IconButton
                onClick={() => this.editMessage()}
                style={{ width: 48, height: 48, borderRadius: 24 }}>
                <Check style={{ color: theme.textColor }} />
              </IconButton>
              <IconButton
                onClick={() => this.setState({ editing: false })}
                style={{ width: 48, height: 48, borderRadius: 24 }}>
                <Clear style={{ color: theme.textColor }} />
              </IconButton>
            </div>
          ) : (
            <IconButton
              style={{
                display:
                  firebase.auth().currentUser.uid === this.Item.userUID
                    ? this.state.editButtonVisible
                      ? "flex"
                      : "none"
                    : "none",
                width: 48,
                height: 48,
                borderRadius: 24,
                marginRight: 16,
              }}
              onClick={() => this.setState({ editing: true })}>
              <Edit style={{ color: theme.textColor }} />
            </IconButton>
          )}
        </div>
      );
    else return null;
  }
}
