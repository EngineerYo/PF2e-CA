/* 	opts
 *		caster			string
 *		selfTarget		boolean
 * 		checkWalls		boolean
*/

let defaultOpts = {
	selfTarget: false,
	checkWalls: true
}

Hooks.on('createMeasuredTemplate', function(scene, object, result, user) {
	object.getActors = function(opts = defaultOpts) {
		let gameObj = canvas.templates.get(this._id)
		let player = game.users.get(gameObj.data.user)

		// Clear target list
		for (let token of player.targets) {
			token.setTarget(false, {user: player, releaseOthers: false})
		}
		player.targets.clear()

		// Get MeasuredTemplate position
		let posX = gameObj.x
		let posY = gameObj.y

		// Get valid tokens in shape
		let filteredTokens = canvas.tokens.placeables.filter(token => {
			let tokenPosX = token.x + token.w/2 - posX
			let tokenPosY = token.y + token.h/2 - posY

			// If token isn't an actor
			if (!token.actor) {
				return false
			}

			// If we shouldn't target the speaker
			if (opts.selfTarget == false && opts.caster == token.name) {
				return false
			}

			// If token is in MeasuredTemplate shape
			if (!gameObj.shape.contains(tokenPosX, tokenPosY)) {
				return false
			}

			// Check for wall collisions
			if (opts.checkWalls != undefined && opts.checkWalls == true) {
				let ray = new Ray({x: tokenPosX, y: tokenPosY}, self.data)
				return !canvas.walls.checkCollision(ray)
			}

			return true
		})

		// Select tokens
		console.log(`I am ${player.data.name} and I endorse this message`)
		for (let token of filteredTokens) {
			player.targets.add(token)
		}
		// filteredTokens.forEach(token => {
		// 	token.setTarget(true, {user: player, releaseOthers: false})
		// 	player.targets.add(token)
		// })
	}

	object.getActors(object)
})

Hooks.on('ready', function() {
	console.log(`PF2e-CA\t|\tReady`)
})