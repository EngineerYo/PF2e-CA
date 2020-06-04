/* 	opts
 *		caster			string
 *		selfTarget		boolean
 * 		checkWalls		boolean
*/

let defaultOpts = {
	selfTarget: false,
	checkWalls: true
}

Hooks.on('createMeasuredTemplate', function(scene, object, data, user) {
	object.getActors = function(opts = defaultOpts) {
		let gameObj = canvas.templates.get(this._id)
		console.log(gameObj)

		// Clear target list
		for (let token of game.user.targets) {
			token.setTarget(false, {releaseOthers: false})
		}
		game.user.targets.clear()

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
		filteredTokens.forEach(token => {
			token.setTarget(true, {user: game.user, releaseOthers: false})
			game.user.targets.add(token)
		})
	}

	object.test = function() {
		console.log(`Hello! ${user} created me!\nI'm a ${object.t}!`)
	}

	object.getActors(object)
})

Hooks.on('ready', function() {
	for (let templateData of game.scenes.entities[0].data.templates) {
		let gameObj = canvas.templates.get(templateData._id)
		gameObj.delete()
	}
})