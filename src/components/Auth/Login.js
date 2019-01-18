import React, { Component } from 'react';
import firebase from '../../firebase';
import { Grid, Form, Segment, Button, Header, Message, Icon} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false,
  };

  displayErrors = errors => (
    errors.map((error, i) => {
      return <p key={i}>{error.message}</p>
    })
  );

  handleChange = event => {
    // const result = event.target.name;
    this.setState({ [ event.target.name ]: event.target.value})
  };

  handleSumbit = event => {
    event.preventDefault();
    const { email, password, errors } = this.state;
    if (this.isFormValid(email, password, errors)) {
      this.setState({ errors: [], loading: true });
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(signedInUser => {
          console.log('signedInUser', signedInUser);
        })
        .catch(err => {
          console.error(err);
          this.setState({
            errors: errors.concat(err),
            loading: false,
          })
        })
    }
  };

  isFormValid = (email, password) => {
    return email && password;
  };

  handleInputError = ( errors, inputValue ) => {
    return errors.some(error => error.message.toLowerCase().includes(inputValue)) ? "error" : "";
  };

  render() {
    const { 
      email,
      password,
      errors,
      loading,
    } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" color="violet" textAlign="center">
            <Icon name="code branch" color="violet" />
            Login for DevChat
          </Header>
          <Form onSubmit={this.handleSumbit} size="large">
            <Segment stacked>
              <Form.Input 
                fluid 
                name="email"
                icon="mail"
                iconPosition="left"
                placeholder="Email address"
                onChange={this.handleChange}
                value={email}
                className={this.handleInputError(errors, 'email')}
                type="email"
              />
              <Form.Input 
                fluid 
                name="password"
                icon="lock"
                iconPosition="left"
                placeholder="Passwrod"
                onChange={this.handleChange}
                value={password}
                className={this.handleInputError(errors, 'password')}
                type="password"
              />
              <Button
                disabled={loading}
                className={loading ? 'loading': ''}
                color="violet"
                fluid
                size="large"
              >
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>Don't Have Account? <Link to="/register">Register</Link></Message>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;