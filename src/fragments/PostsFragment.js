import * as React from "react";
import * as firebase from "firebase";
import { theme } from "../css/Theme";
import PostItem from "../components/PostItem";
import "../css/ScrollBar.css";
import { routeNav } from "../redux/routeNavState";
import { Avatar, Chip, IconButton } from "@material-ui/core";
import { ChevronLeft, ChevronRight, Edit } from "@material-ui/icons";

export default class PostsFragment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      visible: true,
      groups: [],
      groupFilter: null,
      loading: true,
    };
  }

  async componentDidMount() {
    routeNav.subscribe(() =>
      this.setState({ visible: routeNav.getState().type === null })
    );
    this.db = firebase.database().ref("posts");
    this.dbTwo = firebase.database().ref("groups");
    await this.loadPosts();
    await this.dbTwo.once("value", (snapshot) => {
      snapshot.forEach((item) => {
        this.setState({
          groups: [...this.state.groups, { ...item.val(), key: item.key }],
        });
      });
    });
    this.setState({ loading: false });
  }

  componentWillUnmount() {
    this.db.off();
  }

  loadPosts = () => {
    this.db.once("value", (snapshot) => {
      snapshot.forEach((item) => {
        this.setState({
          posts: [...this.state.posts, { ...item.val(), key: item.key }],
        });
      });
    });
  };

  filterPosts = (key) => {
    this.setState({ posts: [] });
    if (key != null) {
      this.db
        .orderByChild("groupName")
        .equalTo(key)
        .once("value", (snapshot) => {
          snapshot.forEach((item) => {
            this.setState({
              posts: [...this.state.posts, { ...item.val(), key: item.key }],
            });
          });
        });
    } else {
      this.loadPosts();
    }
  };
  render() {
    if (!this.state.loading)
      return (
        <div
          style={{
            display: this.state.visible ? "flex" : "none",
            flexDirection: "column",
            flex: 1,
          }}>
          <div
            style={{
              position: "fixed",
              display: "flex",
              overflowY: "auto",
              flexDirection: "row",
              opacity: 0.8,
              backgroundColor: theme.textBoxColor,
              alignItems: "center",
              width: "100%",
              padding: 16,
              zIndex: 500,
            }}
            className="divScroll">
            <IconButton style={{ marginRight: 12 }}>
              <Edit style={{ color: theme.textColor }} />
            </IconButton>
            <IconButton
              onClick={() => (this.groupDiv.scrollLeft -= 25)}
              style={{ marginRight: 12 }}>
              <ChevronLeft style={{ color: theme.textColor }} />
            </IconButton>
            <IconButton onClick={() => (this.groupDiv.scrollLeft += 25)}>
              <ChevronRight style={{ color: theme.textColor }} />
            </IconButton>
            <span
              style={{ color: theme.textColor, fontSize: 16, marginLeft: 12 }}>
              Filter posts:{" "}
            </span>
            <div
              ref={(ref) => (this.groupDiv = ref)}
              style={{
                overflowX: "auto",
                display: "flex",
                flexDirection: "row",
                flexWrap: "nowrap",
                flex: 1,
                alignItems: "center",
              }}>
              {this.state.groups.map((item) => (
                <Chip
                  label={item.key}
                  avatar={<Avatar src={item.imageUrl} />}
                  onClick={() => {
                    this.setState({
                      groupFilter:
                        item.key === this.state.groupFilter ? null : item.key,
                    });
                    this.filterPosts(
                      item.key === this.state.groupFilter ? null : item.key
                    );
                  }}
                  style={{
                    marginLeft: 16,
                    color:
                      this.state.groupFilter === item.key
                        ? theme.textColorOnPrimary
                        : theme.textColor,
                    backgroundColor:
                      this.state.groupFilter === item.key
                        ? theme.primary
                        : theme.cardColor,
                  }}
                />
              ))}
            </div>
          </div>
          <div
            style={{
              height: "100%",
              overflowY: "auto",
              padding: 24,
            }}
            className="divScroll">
            <div style={{ height: 64 }}></div>
            {this.state.posts.map((item) => (
              <PostItem Item={item} />
            ))}
          </div>
        </div>
      );
    else return null;
  }
}
