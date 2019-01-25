import React, { Component } from 'react';
import { Segment, Input, Button } from 'semantic-ui-react';
import firebase from '../../firebase';

class MessageForm extends Component {
  state = {
    message: '',
    loading: false,
    errors: [],
  };

  handleChange = event  => {
    this.setState({ [event.target.name]: event.target.value })
  };

  createMessage = () => {
    const { currentUser } = this.props;
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL
      },
      content: this.state.message
    }

    return message;
  };

  sendMessage = () => {
    const { messagesRef, currentChannel } = this.props;
    const { message } = this.state;

    if (message) {
      this.setState({ loading: true });
      messagesRef
       .child(currentChannel.id)
       .push()
       .set(this.createMessage())
       .then(() => {
         this.setState({ loading: false, message: '', errors: [] })
       })
       .catch(err => {
         this.setState({ 
           loading: false,
           errors: this.state.errors.concat(err)}
          )
       });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: 'Add a message' })
      })
    }
  };

  render() {
    const { errors, message, loading } = this.state;
    return(
      <Segment className="message__form">
        <Input 
          fluid
          name="message"
          onChange={this.handleChange}
          value={message}
          style={{ marginBottom: "0.7rem" }}
          label={<Button icon={"add"} />}
          labelPosition="left"
          className={
            errors.some(error => error.message.includes('message')) ? 'error' : ''
          }
          placeholder="Write your message"
        />
        <Button.Group>
          <Button 
            onClick={() => this.sendMessage()}
            disabled={loading}
            color="orange"
            content="Add reply"
            labelPosition="left"
            icon="edit"
          />
          <Button 
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
          />
        </Button.Group>
      </Segment>
    );
  }
}

export default MessageForm;