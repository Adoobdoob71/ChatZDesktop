import { IconButton } from "@material-ui/core";
import * as React from "react";
import { theme } from "../css/Theme";
import { routeNav } from "../redux/routeNavState";
import { ChevronLeft } from "@material-ui/icons";
import "../css/ScrollBar.css";
import * as firebase from "firebase";
import CommentItem from "../components/CommentItem";

export default class PostScreenFragment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      details: null,
      comments: [],
    };
  }

  async componentDidMount() {
    routeNav.subscribe(async () => {
      this.setState({
        active: routeNav.getState().type === "post",
        details: routeNav.getState().postDetails,
        comments: [],
      });
      if (routeNav.getState().type === "post") {
        this.db = firebase
          .database()
          .ref("posts")
          .child(routeNav.getState().postDetails.key)
          .child("comments");
        await this.db.once("value", (snapshot) => {
          snapshot.forEach((item) => {
            this.setState({ comments: [...this.state.comments, item.val()] });
          });
        });
        this.db.off();
      }
    });
  }

  render() {
    if (this.state.details)
      return (
        <div
          style={{
            display: this.state.active ? "flex" : "none",
            flex: 1,
            flexDirection: "column",
          }}>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              height: 64,
              alignItems: "center",
              backgroundColor: theme.cardColor,
            }}>
            <IconButton
              style={{ marginLeft: 12 }}
              onClick={() =>
                routeNav.dispatch({ type: { type: null, details: null } })
              }>
              <ChevronLeft style={{ color: theme.textColor }} />
            </IconButton>
            <span
              style={{ color: theme.textColor, fontSize: 18, marginLeft: 12 }}>
              Post
            </span>
          </div>
          <div
            style={{
              display: "flex",
              padding: 24,
              height: "100%",
              overflowY: "auto",
              flexDirection: "column",
            }}
            className="divScroll">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 24,
              }}>
              <img
                src={this.state.details.groupImage}
                style={{ width: 48, height: 48, borderRadius: 24 }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  marginLeft: 12,
                }}>
                <span style={{ color: theme.textColor, fontSize: 18 }}>
                  {this.state.details.title}
                </span>
                <span
                  style={{
                    color: theme.placeholderColor,
                    fontSize: 14,
                    marginTop: 2,
                  }}>
                  {this.state.details.groupName}
                </span>
              </div>
            </div>
            <span
              style={{
                color: theme.textColor,
                fontSize: 18,
                flex: 1,
                marginLeft: 48,
                marginRight: 16,
                marginBottom: 16,
              }}>
              {this.state.details.body}
            </span>
            <img
              src={this.state.details.imageUrl}
              style={{
                maxWidth: "80%",
                alignSelf: "center",
                marginBottom: 24,
                borderRadius: 16,
              }}
            />
            {this.state.comments.map((item) => (
              <CommentItem Item={item} />
            ))}
          </div>
        </div>
      );
    else return null;
  }
}
