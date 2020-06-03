/* 	opts
 *		caster			string
 *		selfTarget		boolean
 * 		checkWalls		boolean
*/

MeasuredTemplate.prototype.getActors = function(opts) {
	// Clear target list
	for (token of game.user.targets) {
		token.setTarget(false, {releaseOthers: false})
	}
	game.user.targets.clear()

	// Get MeasuredTemplate position
	let templateDetails = canvas.templates.get(data._id)
	let posX = templateDetails.data.x
	let posY = templateDetails.data.y

	// Get valid tokens in shape
	let filteredTokens = canvas.tokens.placeables.filter(token => {
		let tokenPosX = token.x + token.w/2 - posX
		let tokenPosY = token.y + token.h/2 - posY

		// If token isn't an actor
		if (!token.actor) {
			return false
		}

		// If we shouldn't target the speaker
		if (opts.caster != undefined && opts.selfTarget == false && opts.caster == token.name) {
			return false
		}

		// If token is in MeasuredTemplate shape
		if (!self.shape.contains(tokenPosX, tokenPosY)) {
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
		game.user.targets.add(target)
	})

	
}