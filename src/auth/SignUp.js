/*
 *   Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 *  Licensed under the Apache License, Version 2.0 (the "License").
 *  You may not use this file except in compliance with the License.
 *  A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the "license" file accompanying this file. This file is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *  express or implied. See the License for the specific language governing
 *  permissions and limitations under the License.
 */
import React from "react";
import { Auth } from "aws-amplify";
import DynamicImage from "../components/DynamicImage";
// import { withRouter } from "react-router-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import "../css/app.css";

async function cognitoSignUp(params) {
  try {
    const { user } = await Auth.signUp(params);
    console.log(user);
  } catch (error) {
    console.log("error signing up:", error);
  }
}

async function confirmCognitoSignUp(username, code) {
  try {
    console.log(`CONFIRMING:  ${username}: code ${code}`);
    await Auth.confirmSignUp(username, code);
  } catch (error) {
    console.log("error confirming sign up", error);
  }
}

/**
 * Registration Page
 */
class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
      email: "",
      phone: "",
      password: "",
      confirm: "",
      code: "",
    };
  }

  async onSubmitForm(e) {
    e.preventDefault();

    const signupParams = {
      username: this.state.email,
      password: this.state.password,
      autoSignIn: {
        enabled: true,
      },
    };
    console.log("signupParams", signupParams);
    await cognitoSignUp(signupParams);

    console.log("Form Submitted");
    this.setState({ stage: 1 });
  }

  async onSubmitVerification(e) {
    e.preventDefault();

    await confirmCognitoSignUp(this.state.email, this.state.code);
    console.log("Verification Submitted");
    this.setState({
      stage: 0,
      code: "",
      email: "",
      phone: "",
      password: "",
      confirm: "",
    });

    this.props.navigate("/signin");
  }

  onEmailChanged(e) {
    this.setState({ email: e.target.value.toLowerCase() });
  }

  onPhoneChanged(e) {
    this.setState({ phone: e.target.value });
  }

  onPasswordChanged(e) {
    this.setState({ password: e.target.value });
  }

  onConfirmationChanged(e) {
    this.setState({ confirm: e.target.value });
  }

  onCodeChanged(e) {
    this.setState({ code: e.target.value });
  }

  isValidEmail(email) {
    var re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  renderSignUp() {
    const isValidEmail = this.isValidEmail(this.state.email);
    const isValidPassword = this.state.password.length > 1;
    const isValidConfirmation =
      isValidPassword && this.state.password === this.state.confirm;

    return (
      <div className="app">
        <header>
          <DynamicImage src="logo.png" />
        </header>
        <section className="form-wrap">
          <h1>Register</h1>
          <form id="registrationForm" onSubmit={(e) => this.onSubmitForm(e)}>
            <input
              className={isValidEmail ? "valid" : "invalid"}
              type="email"
              placeholder="Email"
              value={this.state.email}
              onChange={(e) => this.onEmailChanged(e)}
            />
            <input
              className="valid"
              type="phone"
              placeholder="Phone"
              value={this.state.phone}
              onChange={(e) => this.onPhoneChanged(e)}
            />
            <input
              className={isValidPassword ? "valid" : "invalid"}
              type="password"
              placeholder="Password"
              value={this.state.password}
              onChange={(e) => this.onPasswordChanged(e)}
            />
            <input
              className={isValidConfirmation ? "valid" : "invalid"}
              type="password"
              placeholder="Confirm Password"
              value={this.state.confirm}
              onChange={(e) => this.onConfirmationChanged(e)}
            />
            <input
              disabled={
                !(isValidEmail && isValidPassword && isValidConfirmation)
              }
              type="submit"
              value="Let's Ryde"
            />
          </form>
        </section>
      </div>
    );
  }

  renderConfirm() {
    const isValidEmail = this.isValidEmail(this.state.email);
    const isValidCode = this.state.code.length === 6;

    return (
      <div className="app">
        <header>
          <DynamicImage src="logo.png" />
        </header>
        <section className="form-wrap">
          <h1>Verify Email</h1>
          <form id="verifyForm" onSubmit={(e) => this.onSubmitVerification(e)}>
            <input
              className={isValidEmail ? "valid" : "invalid"}
              type="email"
              placeholder="Email"
              value={this.state.email}
            />
            <input
              className={isValidCode ? "valid" : "invalid"}
              type="text"
              placeholder="Verification Code"
              value={this.state.code}
              onChange={(e) => this.onCodeChanged(e)}
            />
            <input
              disabled={!(isValidCode && isValidEmail)}
              type="submit"
              value="Verify"
            />
          </form>
        </section>
      </div>
    );
  }

  render() {
    switch (this.state.stage) {
      case 0:
      default:
        return this.renderSignUp();
      case 1:
        return this.renderConfirm();
    }
  }
}

const withRouter = (Component) => (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = useParams();

  console.log("PROPS", props);
  return (
    <Component
      {...props}
      location={location}
      navigate={navigate}
      params={params}
    />
  );
};

export default withRouter(SignUp);
