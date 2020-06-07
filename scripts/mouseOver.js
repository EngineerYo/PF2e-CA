export function mouseOverFunctions() {
	console.log(`PF2e-CA\t|\tmouseOverFunctions\t|\tReady`)

	$('.roll-mod').mouseover(function(event) {
		event.target.innerHTML = event.target.getAttribute('data-result')
	})
	$('.roll-mod').mouseleave(function(event) {
		event.target.innerHTML = event.target.getAttribute('data-total')
	})

	$('.targetPicker').mouseover(function(e) {
		if (event.target != event.currentTarget) {
			return
		}

		let actorID = e.target.getAttribute('data-target')
		let actorObj = canvas.getLayer('TokenLayer').get(actorID)

		actorObj._onHoverIn()
	})
	$('.targetPicker').mouseleave(function(e) {
		if (event.target != event.currentTarget) {
			return
		}

		let actorID = e.target.getAttribute('data-target')
		let actorObj = canvas.getLayer('TokenLayer').get(actorID)

		actorObj._onHoverOut()
	})
}	