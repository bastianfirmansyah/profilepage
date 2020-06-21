import React, { Component } from "react";
import fire from "./fire";
import ProfilePage from "./Component/ProfilePage";
class App extends Component {
	constructor(props) {
		super(props);
		this.state = { messages: [] };
	}
	componentWillMount() {
		let messagesRef = fire
			.database()
			.ref("mydata")
			.orderByKey()
			.limitToLast(100);
		messagesRef.on("child_added", (snapshot) => {
			let message = { text: snapshot.val(), id: snapshot.key };
			this.setState({ messages: [message].concat(this.state.messages) });
		});
		messagesRef.on("child_removed", (snapshot) => {
			let deletedMessages = { text: snapshot.val(), id: snapshot.key };
			let modifiedMessages = this.state.messages.filter(function (item) {
				return item.id !== deletedMessages.id;
			});

			this.setState({ messages: modifiedMessages });
		});

		messagesRef.on("child_changed", (snapshot) => {
			let modifiedMessages = { text: snapshot.val(), id: snapshot.key };
			let messages = this.state.messages;

			for (let item of messages) {
				if (item.id === modifiedMessages.id) {
					item.text = modifiedMessages.text;
					break;
				}
			}

			this.setState({ messages: messages });
		});
	}

	addMessage(e) {
		e.preventDefault();
		fire.database().ref("mydata").push(this.inputEl.value);
		this.inputEl.value = "";
	}
	render() {
		return (
			
      <div>
      <form onSubmit={this.addMessage.bind(this)}>
				<input type="text" ref={(el) => (this.inputEl = el)} />
				<input type="submit" />
				<ul>
					{this.state.messages.map((message) => (
						<li key={message.id}>{message.text}</li>
					))}
				</ul>
			</form>
      <ProfilePage/>
      </div>
       
    );
   
    
    

    
	}
}
export default App;
