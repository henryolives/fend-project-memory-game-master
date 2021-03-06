/*
 * Create a list that holds all of your cards
 */
let totalMove = document.querySelector('.moves');
let spanMove = document.querySelector('.spanMoves');
let spanTimer = document.querySelector('.spanTimer');
const cards = document.querySelectorAll('.card');
const allCards = [...cards];
const deck = document.querySelector('.deck');
let openedCards = [];
let counter = 0;
let umatchCount = 0;
let start = 0;
const modal = document.getElementById('myModal');
let totalStars = document.querySelectorAll('.star');
const starParent = document.querySelector('.stars');
let modalStars = document.querySelector('.modalStars');
let finalStars = [...totalStars];
let time = 0;
let timeLaps = document.querySelector('.timer');


document.body.onload = refresh();

function refresh() {
	totalMove.textContent = '0 Move';
	modal.style.display = "none";
	for (let card of shuffle(allCards)) {
		deck.appendChild(card);
		card.classList.remove('open', 'show', 'match');
	}
	openedCards.length = 0;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


startGame();


function startGame() {
	for (let card of allCards) {
		card.addEventListener("click", function(){
			openCard(card);
			matchCards();
			moveCounter();
			starRating();
			showModal(counter);
		})
	}
}


function addToList(card) {
	if (openedCards.length <= 1) {
		openedCards.push(card.children[0].classList.value);
	} else {
		if (openedCards[0].localeCompare(card.children[0].classList.value) != 0) {
			openedCards.shift();
			openedCards.push(card.children[0].classList.value);
		}
	}
}

/*
*	check if there is atmost 1 item, 
*	if not remove the first one and replace with the current one
*/

function openCard(card) {
	if (!card.classList.contains('open')) {
		card.classList.add('open', 'show');
		addToList(card);
	}
} 

/*
*	check if an unmatched card is open, show that its unmacthed briefly and hide it
*	clear the list of opened cards
*/

function hideUmatchedCards(element) {
	if (element.parentElement.classList.contains('open')) {
		element.parentElement.classList.add('unmatch');
		setTimeout(function() {
			element.parentElement.classList.remove('unmatch','open','show');
		},300)
	}
	openedCards.length = 0;
}

/*
 *	Check if the children of the cards in openedCards have the same classes.
 *	If they do, add match class to both cards and clear the list.
 *	If not, hide the cards.
 */

function matchCards() {
	if (openedCards.length > 1 && openedCards[0].localeCompare(openedCards[1]) == 0) {
		let matched = document.querySelectorAll(`.${openedCards[1].substring(3,openedCards[1].length)}`);
		matched.forEach(function(element){
			element.parentElement.classList.add('match');
			counter += 1/2;
		})
		openedCards.length = 0;
	} else {
		umatchCount += 1/2;
		setTimeout(function() {
			if (openedCards.length > 1 && openedCards[0].localeCompare(openedCards[1]) != 0) {
				let unmatched = document.querySelectorAll(`.${openedCards[0].substring(3,openedCards[0].length)}`);
				let unmatchedtwo = document.querySelectorAll(`.${openedCards[1].substring(3,openedCards[1].length)}`);
				unmatchedtwo.forEach(hideUmatchedCards);
				unmatched.forEach(hideUmatchedCards);
			}
		},200);
	}
}


function moveCounter() {
	let total = Math.floor(0.5*counter + umatchCount);
	if ( total == 0) {
		startTime();
	}
	if (total > 1 ) {
		totalMove.textContent = `${total}  Moves`;
	} else {
		totalMove.textContent = `${total}  Move`;
	}
}



function starRating() {
	let total = 0.5*counter + umatchCount;
	if (total <= 15 && counter ==8) {
		starParent.appendChild(totalStars[0].cloneNode(true));
		finalStars.push(totalStars[0])
	}
	if (total == 16) {
		finalStars.splice(-1, 1);
		starParent.removeChild(totalStars[0]);	
	}
	if (total == 20 ) {
		starParent.children[0].remove()
		finalStars.splice(-1, 1);
	}
}




function startTime() {
	if (counter < 7) {
		setTimeout(function () {
			time++;
			let hr = Math.floor((time/3600) % 60);
			let min = Math.floor((time/60) % 60);
			let sec = Math.floor(time % 60);
			timeLaps.textContent = `${hr}:${min}:${sec}`;
			startTime();
		},1000);
	}
}


function showModal(counter) {
	let total = Math.floor(0.5*counter + umatchCount);
		if (counter === 8 ) {
			modal.style.display = "block";
			spanTimer.textContent = timeLaps.textContent;
			spanMove.textContent = total + ' Moves';
			for (let i = 0; i < finalStars.length; i++ ) {
				modalStars.appendChild(totalStars[0].cloneNode(true));
			}
		}
}


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}