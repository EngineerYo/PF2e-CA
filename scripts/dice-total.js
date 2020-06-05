export function hoverDiceTotal() {
	console.log(`PF2e-CA\t|\tHovering Dice Rolls`)
	$('#chat-log').on('mouseover', '.roll-mod', function(event) {
		event.target.innerHTML = event.target.getAttribute('data-result')
	})
	$('#chat-log').on('mouseout', '.roll-mod', function(event) {
		event.target.innerHTML = event.target.getAttribute('data-total')
	})
}