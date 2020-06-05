export function hoverDiceTotal() {
	$('#chat-log').on('mouseover', '.roll-mod', function(event) {
		event.target.innerHTML = event.target.getAttribute('data-result')
		// event.target.parentElement.querySelector('#Total').style.visibility = 'hidden'
		// event.target.parentElement.querySelector('#Result').style.visibility = 'visible'
	})
	$('#chat-log').on('mouseout', '.roll-mod', function(event) {
		event.target.innerHTML = event.target.getAttribute('data-total')
		// event.target.parentElement.querySelector('#Total').style.visibility = 'visible'
		// event.target.parentElement.querySelector('#Result').style.visibility = 'hidden'
	})
}