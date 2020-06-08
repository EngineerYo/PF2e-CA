export function mouseOverFunctions() {
	console.log(`PF2e-CA\t|\tmouseOverFunctions\t|\tReady`)

	$('#chat-log').on('mouseover', '.roll-mod', function(e) {
		e.target.innerHTML = e.target.getAttribute('data-result')
	})
	$('#chat-log').on('mouseleave', '.roll-mod', function(e) {
		e.target.innerHTML = e.target.getAttribute('data-total')
	})

	$('#chat-log').on('mouseover', '.targetPicker', function(e) {
		if (e.target != e.currentTarget) {
			return
		}

		let actorID = e.target.getAttribute('data-target')
		let actorObj = canvas.getLayer('TokenLayer').get(actorID)

		actorObj._onHoverIn()
	})
	$('#chat-log').on('mouseleave', '.targetPicker', function(e) {
		if (e.target != e.currentTarget) {
			return
		}

		let actorID = e.target.getAttribute('data-target')
		let actorObj = canvas.getLayer('TokenLayer').get(actorID)

		actorObj._onHoverOut()
	})

	$('#chat-log').on('click', '.targetPicker', function(e) {
		let content = $(e.currentTarget).find('.content')[0]

		// Collapsed
		if (content.style.display == 'none') {
			content.style.display = 'inline'
		}

		// Expanded
		else {
			content.style.display = 'none'
		}
	})

	
}