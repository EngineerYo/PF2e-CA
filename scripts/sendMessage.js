export function sendMessage(chatData) {
	console.log(`PF2e-CA\t|\tSending Message`)
	chatData.user = game.users.entities.find(user => user.isGM)._id
	chatData.speaker = ChatMessage.getSpeaker( {user: game.user})
	
	ChatMessage.create(chatData)
}