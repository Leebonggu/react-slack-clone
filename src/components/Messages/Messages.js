import React, { Component, Fragment } from 'react';
import { Segment, Comment } from 'semantic-ui-react';

import firebase from '../../firebase';
import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    messages: [],
    messagesLoading: true,
  }

  componentDidMount() {
    const { currentChannel, currentUser } = this.props;

    if (currentChannel && currentUser) {
      this.addListeners(currentChannel.id);
    }
  }

  addListeners = (channelId) => {
    this.addMessageListener(channelId)
  };

  addMessageListener = (channelId) => {
    const { messagesRef } = this.state;
    let loadedMessages = [];

    messagesRef.child(channelId).on('child_added', snapshot => {
      loadedMessages.push(snapshot.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false,
      })
    });
  };

  displayMessages = (messages, currentUser) => {
   return messages.length > 0 && messages.map((message, index) => (
      <Message 
        key={`${index}-${message.timestamp}`}
        message={message}
        user={currentUser}
      />
    ));
  } 

  render() {
    const { messagesRef, messages } = this.state;
    const { currentChannel, currentUser } = this.props;
    return(
      <Fragment>
        <MessagesHeader />
        <Segment>
          <Comment.Group className="messages">
          {/* Messages */}
          {this.displayMessages(messages, currentUser)}
          </Comment.Group>
        </Segment>
        <MessageForm 
          messagesRef={messagesRef}
          currentChannel={currentChannel}
          currentUser={currentUser}
        />
      </Fragment>
    );
  }
};

export default Messages;