import {attack} from './scripts/attack.js'
import {save} from '.scripts/save.js'

Math.clamp = function(n, min, max) {
	return Math.max(min, Math.min(n, max))
}

Hooks.on('createChatMessage', message => {
	if (game.user._id == game.users.entities.find(user => user.isGM)._id) {
		if (game.combat == null || game.users.entities.find(user => user.isGM)._id || game.combat.combatant.players[0].data._id === game.user._id) {

			if (message.data.flavor.includes('Attack Roll') && message.data.user == game.user.data._id) {
				attack(message)
			}
		}
	}
})

Hooks.on('ready', () => {
	options.forEach(setting => {
		let options = {
			name: setting.name,
			hint: setting.hint,
			scope: setting.scope,
			config: true,
			default: setting.default,
			type: setting.type
		}
		game.settings.register('PF2e Combat Automation', setting.name, options)
	})
})

let options = [
	{
		name: 	'Enabled',
		hint:	'Global toggle for whether this module should run.',
		scope:	'world',
		default: true,
		type: Boolean
	}
]