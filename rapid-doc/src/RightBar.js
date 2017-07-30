import React, { Component } from 'react';

import InputField from './InputField.js';
import ListHeader from './ListHeader.js';
import MessageRow from './MessageRow.js';
import { currentUser, userByName } from './User';
import UserRow from './UserRow.js';
import client from './rapid/client'
import dev from './images/dev-gh.png'
import dude1 from './images/dude1.png'
import dude2 from './images/dude2.png'
import dude3 from './images/dude3.png'
import dude4 from './images/dude4.png'
import kim from './images/kim-gh.png'

const styles = {
	container: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'stretch',
	},
	inputContainer: {
		display: 'flex',
		backgroundColor: 'black',
	},
	top: {
		flex: 1,
	},
	userContainer: {
		height: 380,
		boxShadow: '0px 5px 5px -3px #888888',
	},
	messageContainer: {
		flex: 1,
		borderTop: '1px solid #EAEAEA',
		overflowY: 'auto',
	},
}

export default class rightBar extends Component {
	constructor(props) {
		super()

		const { id } = props

		this.state = {
			messages: [],
		}

		this.subscription = client
			.collection('messages')
			.subscribe(messages => {
				this.setState({ messages })
			})

		this.handleCreateMessages = this.handleCreateMessages.bind(this);
	}

	componentWillUnmount() {
		this.subscription.unsubscribe()
	}

	async handleCreateMessages(messageText) {
		const { id } = this.props;

		console.log('Getting message...')

		try {
			const success = await client
				.collection('messages')
				.newDocument()
				.mutate({
					messageText,
					username: currentUser.username,
				})
			console.log('Created message', success)
		} catch (e) {
			console.log('handled message not-change', id, messageText)
		}
	}

	renderMessage = (message) => {
		const { id, body: { messageText, username = 'kialvare' } } = message;

		return (
			<MessageRow
				image={(userByName[username] || {}).image}
				user={username}
				text={messageText}
			/>
		);
	}

	render() {
		const { messages } = this.state
		return (
			<div style={styles.container}>
				<div style={styles.userContainer}>
					<ListHeader text={'MAINTAINERS'} />
					<UserRow image={dev} text={'dabbott'} />
					<UserRow image={kim} text={'kialvare'} />
					<ListHeader text={'CONTRIBUTORS'} />
					<UserRow image={dude1} text={'chucknorris'} />
					<UserRow image={dude2} text={'bobross'} />
					<UserRow image={dude3} text={'thatoneguy'} />
					<UserRow image={dude4} text={'supermario'} />
					<ListHeader text={'MESSAGES'} />
				</div>
				<div style={styles.messageContainer}>
					{
						messages.map(this.renderMessage)
					}
				</div>
				<div style={styles.inputContainer}>
					<InputField onSubmit={this.handleCreateMessages} />
				</div>
			</div>
		);
	}
}
