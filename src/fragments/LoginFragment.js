import { Backdrop, Button, IconButton, TextField } from "@material-ui/core";
import * as React from "react";
import { theme } from "../css/Theme";
import * as firebase from "firebase";
import { Clear } from "@material-ui/icons";
import { loginState } from "../redux/LoginState";

export default class LoginFragment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      error: null,
      open: false,
      loading: false,
    };
  }

  componentDidMount() {
    loginState.subscribe(() => this.setState({ open: loginState.getState() }));
  }

  Login = () => {
    this.setState({ loading: true });
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email.trim(), this.state.password)
      .then(() => {
        this.setState({
          loading: false,
          error: null,
          email: "",
          password: "",
        });
        loginState.dispatch({ type: false });
      })
      .catch((error) => this.setState({ error: error, loading: false }));
  };

  Cancel = () => {
    this.setState({ email: "", password: "", error: null });
    loginState.dispatch({ type: false });
  };

  render() {
    return (
      <Backdrop open={this.state.open} style={{ zIndex: 1000 }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 16,
            paddingBottom: 8,
            backgroundColor: theme.backgroundColor,
            borderRadius: 8,
          }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <span
              style={{
                color: theme.textColor,
                fontSize: 20,
                textAlign: "center",
              }}>
              Login
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 16,
              marginBottom: 24,
            }}>
            <TextField
              label="Email"
              color="primary"
              value={this.state.email}
              style={{ width: 450, color: theme.textColor }}
              onChange={(event) =>
                this.setState({
                  email: event.currentTarget.value,
                  error: null,
                })
              }
              error={this.state.error}
              helperText={
                this.state.error != null
                  ? this.state.error.message
                  : "Put your email here"
              }
            />
            <TextField
              label="Password"
              color="primary"
              value={this.state.password}
              style={{ width: 450, marginTop: 16, color: theme.textColor }}
              onChange={(event) =>
                this.setState({
                  password: event.currentTarget.value,
                  error: null,
                })
              }
              type="password"
              error={this.state.error}
              helperText={
                this.state.error != null
                  ? this.state.error.message
                  : "Put your passowrd here"
              }
            />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={() => this.Cancel()}
              variant="text"
              color="primary">
              Cancel
            </Button>
            <Button
              onClick={() => this.Login()}
              variant="contained"
              color="primary"
              style={{ marginLeft: 12 }}
              disabled={
                this.state.email.length == 0 ||
                this.state.password.length == 0 ||
                this.state.loading
              }
              ref>
              Login
            </Button>
          </div>
        </div>
      </Backdrop>
    );
  }
}
