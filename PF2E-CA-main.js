import {attack} from './scripts/attack.js'
import {hoverDiceTotal} from './scripts/dice-total.js'

Math.clamp = function(n, min, max) {
	return Math.max(min, Math.min(n, max))
}

Hooks.on('createChatMessage', (message) => {
	if (game.combat == null || game.users.entities.find(user => user.isGM)._id || game.combat.combatant.players[0].data._id === game.user._id) {
		if (message.data.flavor == undefined) {
			return
		}
		if (message.data.flavor.includes('Attack Roll') && message.data.user == game.user.data._id) {
			attack(message)
		}
	}
})

Hooks.on('renderChatLog', function() {
	hoverDiceTotal()
})