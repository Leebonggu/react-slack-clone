import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

import { setCurrentChannel } from '../../redux/actinos';
import firebase from '../../firebase';

class Channels extends Component {
  state = {
    activeChannel: '',
    user: this.props.currentUser,
    channels: [],
    channelsDB: firebase.database().ref('channels'),
    channelName: '',
    channelDetails: '',
    modal: false,
    firstLoad: true,
  }

  componentDidMount() {
   this.addListeners(); 
  };

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    const { channelsDB } = this.state;
    let loadedChannels = [];
    channelsDB.on('child_added', snapshot => {
      loadedChannels.push(snapshot.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
    });
  };

  removeListeners = () => {
    const { channelsDB } = this.state;
    channelsDB.off();
  };
  
  setFirstChannel = () => {
    const { firstLoad, channels } = this.state;
    const { setCurrentChannel } = this.props;
    const firstChannel = channels[0];
    if (firstLoad && channels.length > 0) {
      setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstLoad: false });
  };

  addChannel = () => {
    const { channelsDB, channelName, channelDetails, user } = this.state;
    const key = channelsDB.push().key;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
      }
    };
    channelsDB
    .child(key)
    .update(newChannel)
    .then(() => {
      this.setState({
        channelName: '',
        channelDetails: ''
      });
      this.closeModal();
    })
    .catch(err => {
      console.log(err);
    })
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      console.log('added');
      this.addChannel();
    }
  };

  isFormValid = ({ channelName, channelDetails }) => ( channelName && channelDetails );
  
  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false });

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  changeChannel = (channel) => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
  };

  setActiveChannel = (channel) => {
    this.setState({ activeChannel: channel.id })
  };

  displayChannels = (channels) => {
    return channels.length > 0 && channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacitu: 0.7}}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));
  }

  render() {
    const { channels, modal } = this.state;
    return (
      <Fragment>
        <Menu.Menu style={{ paddingBottom: '2rem'}}>
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS 
            </span>
            {" "}
            ({channels.length}) <Icon name="add" onClick={this.openModal}/>
          </Menu.Item>
          {/* Channels */}
          {this.displayChannels(channels)}
        </Menu.Menu>
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About Channels"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Fragment>
    );
  }
}

export default connect(null, { setCurrentChannel })(Channels);