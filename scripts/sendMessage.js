export function sendMessage(chatData) {
	chatData.user = game.users.entities.find(user => user.isGM)._id
	chatData.speaker = ChatMessage.getSpeaker( {user: game.user})
	
	ChatMessage.create(chatData)
}