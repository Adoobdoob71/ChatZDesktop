import * as React from "react";
import * as firebase from "firebase";
import { routeNav } from "../redux/routeNavState";
import { theme } from "../css/Theme";
import { IconButton } from "@material-ui/core";
import { Attachment, Send, MoreVert } from "@material-ui/icons";
import MessageItem from "../components/MessageItem";
import "../css/ScrollBar.css";

export default class ChatFragment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      userDetails: null,
      groupDetails: null,
      visible: false,
      image: { uri: null, blob: null },
      loading: false,
      messageText: "",
      details: null,
    };
  }

  componentDidMount() {
    routeNav.subscribe(() => {
      if (routeNav.getState().details) {
        this.db = firebase
          .database()
          .ref("users")
          .child(routeNav.getState().details.userUID);
        this.dbTwo = firebase
          .database()
          .ref("private_messages")
          .child(routeNav.getState().details.private_messages_ID);
      }
      this.setState({ details: routeNav.getState().details });
      if (routeNav.getState().type === "chat") {
        this.db.off();
        this.dbTwo.off();
        this.setState({ visible: true, messages: [] });
        this.db.on("value", (snapshot) => {
          this.setState({ userDetails: snapshot.val() });
        });
        this.dbTwo.on("child_added", (snapshot) => {
          this.setState({
            messages: [
              ...this.state.messages,
              { key: snapshot.key, ...snapshot.val() },
            ],
          });
          this.bottomDiv.scrollIntoView({ block: "end", behavior: "smooth" });
        });
      } else {
        this.setState({ visible: false, messages: [] });
      }
    });
  }

  componentWillUnmount() {
    this.db.off();
    this.dbTwo.off();
  }

  pickImage = async (event) => {
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   allowsEditing: true,
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   quality: 1,
    // });
    // if (!result.cancelled) {
    const res = await fetch(URL.createObjectURL(event.target.files[0]));
    const blob = await res.blob();
    this.setState({
      image: { uri: URL.createObjectURL(event.target.files[0]), blob: blob },
    });
    // }
  };

  submitMessage = async () => {
    this.setState({ loading: true });
    const key = this.dbTwo.push().key;
    if (this.state.image.blob) {
      let storageRef = firebase
        .storage()
        .ref("images/private_messages")
        .child(this.state.details.key)
        .child(key);
      await storageRef.put(this.state.image.blob).then(() => {
        storageRef.getDownloadURL().then((url) => {
          this.dbTwo.child(key).set({
            text: this.state.messageText.trim(),
            userUID: firebase.auth().currentUser.uid,
            imageUrl: url,
          });
        });
      });
    } else if (this.state.messageText.trim().length != 0) {
      await this.dbTwo.child(key).set({
        text: this.state.messageText.trim(),
        userUID: firebase.auth().currentUser.uid,
      });
    }
    this.setState({ loading: false, messageText: "" });
    this.bottomDiv.scrollIntoView({ block: "end", behavior: "smooth" });
  };

  render() {
    if (this.state.userDetails)
      return (
        <div
          style={{
            display: this.state.visible ? "flex" : "none",
            flexDirection: "column",
            flex: 1,
          }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              backgroundColor: theme.cardColor,
              paddingLeft: 24,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
              alignItems: "center",
            }}>
            <img
              src={this.state.userDetails.profilePictureUrl}
              style={{ height: 56, width: 56, borderRadius: 28 }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                marginLeft: 12,
              }}>
              <span style={{ color: theme.textColor, fontSize: 18 }}>
                {this.state.userDetails.username}
              </span>
              <span style={{ color: theme.placeholderColor, fontSize: 14 }}>
                {this.state.userDetails.description}
              </span>
            </div>
            <IconButton onClick={() => window.alert("Clicked")}>
              <MoreVert style={{ color: theme.textColor }} />
            </IconButton>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              height: "100%",
              width: "100%",
              flex: 1,
            }}
            className="divScroll"
            id="messageList"
            ref={(ref) => (this.messageList = ref)}>
            {this.state.messages.map((item) => (
              <MessageItem Item={item} details={this.state.details} />
            ))}
            <div ref={(ref) => (this.bottomDiv = ref)}></div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: theme.textBoxColor,
              paddingLeft: 12,
              paddingRight: 12,
              paddingTop: 8,
              paddingBottom: 8,
            }}>
            <IconButton onClick={() => {}} disabled={this.state.loading}>
              <Attachment style={{ color: theme.textColor }} />
            </IconButton>
            <input
              type="text"
              style={{
                background: theme.textBoxBrightColor,
                color: theme.textColor,
                flex: 1,
                marginLeft: 12,
                marginRight: 12,
                outline: "none",
                border: "none",
                padding: 8,
              }}
              value={this.state.messageText}
              onChange={(event) =>
                this.setState({ messageText: event.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") this.submitMessage();
              }}
              placeholder="Type something..."
              ref={(ref) => (this.textInput = ref)}
            />
            <IconButton
              onClick={() => this.submitMessage()}
              disabled={this.state.loading}>
              <Send style={{ color: theme.textColor }} />
            </IconButton>
          </div>
        </div>
      );
    else return null;
  }
}
