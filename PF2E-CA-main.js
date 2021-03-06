import {attack} from './scripts/attack.js'
import {mouseOverFunctions} from './scripts/mouseOver.js'

Math.clamp = function(n, min, max) {
	return Math.max(min, Math.min(n, max))
}

Hooks.on('createChatMessage', function(message) {
	if (game.combat == null || game.users.entities.find(user => user.isGM)._id || game.combat.combatant.players[0].data._id === game.user._id) {
		if (message.data.flavor == undefined) {
			return
		}

		console.log(message)
		if ( (message.data.flavor.includes('Attack Roll') || message.data.flavor.includes('Strike:')) && message.data.user == game.user.data._id) {
			attack(message)
		}
	}
	
	// mouseOverFunctions()
})

Hooks.on('ready', function() {
	console.log('willReady')
	mouseOverFunctions()

	Item.rollWeaponDamage = function() {
		console.log('Hello!')
	}
})

