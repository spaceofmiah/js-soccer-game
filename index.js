/**
 * ===================================================================
 * ===================================================================
 *     =================== CONFIGURATIONS ======================
 */



document.body.style.backgroundColor = '#545450';



/** team time bar component (DOM element)
 * This is a bar that displays both team name at left and right 
 * side while current game play time at the middle
 */
const teamTimeBar = document.querySelector('.team_time_bar');
const teamOneName = document.querySelector('.team_one_name');
const teamTwoName = document.querySelector('.team_two_name');



// team time bar layout construct
const teamTimeBarStyles = {
	display : 'flex',
	justifyContent : 'space-around',
	width: '1000px',
	fontSize: '22px',
	padding : '5px',
	alignItems : 'center',
}
styleElement(teamTimeBar, teamTimeBarStyles);

/** platform wrap component (DOM element) */
const platformWrap = document.querySelector('.platform_wrap');
const platformWrapYPos = 30;
const platformWrapXPos = 10;

/** configure the platform wrap top and left padding */
platformWrap.style.paddingTop = `${platformWrapYPos}px`;
platformWrap.style.paddingLeft = `${platformWrapXPos}px`;

/** drawing tools constant */
const canvas = document.querySelector('.platform');
const context = canvas.getContext('2d');
canvas.width = 1000;
canvas.height = 500;

/** goal post constant */
const leftGoalXPos = 8;
// goalWidth + leftGoalXPos === 18
const rightGoalXPos = canvas.width - 18;
const goalYPos = canvas.height / 2.5;
const goalWidth = 10;
const goalHeight = 90;

/** football initializers */
let footballXPos = canvas.width / 2;
let footballYPos = canvas.height / 2;

/** sideline constant */
const padSideline = 8; // pads the sideline into the visible field area

/**
 * The value of padSideline is same as
 * topSideline(vertically) & leftSideline(horizontally)
 */

// vertical position ends at the value of canvas.height, so to make the
// sideline visible, there is need to deduct the padSideline from the
// value of canvas.height
const bottomSideLine = canvas.height - padSideline; // vertically

// horizontal position ends at the value of canvas.width, so to make the
// sideline visible, there is need to deduct the padSideline from the
// value of canvas.width
const rightSideLine = canvas.width - padSideline; // horizontally

// simulation interval constant
let simulationIntervalFlag = true;

// info message constant
const messageXPos = canvas.width / 2.5 + 8;
const messageYPos = padSideline + 30;

// corner flaging constant
let isCorner = false;
// the above immediate constant is set, because we don't want
// Goal Scored to display when a Corner is displayed. Becuase
// sometimes a ball can go above the goal post, to become a
// corner, that doesn't mean it's a goal scored.




// form handling component constant & setup. A football
// game needs to have team name and other details, with our
// forms, we'll be able to retrieve the choices of our user.
const formSubmitBtn = document.querySelector('#submit_btn');
const formLabel = document.querySelector('.form_label');
const formInput = document.querySelector('.form_input');
const formWrap = document.querySelector('.form_wrap');

// global configuration of formWrap
formWrap.style.width = `${canvas.width / 2}px`;


formWrapYPos = 82;


const GAME_QUESTIONS = [
	'Enter team name',
	// 'Enter player names',
]

let current_question = 0;
// whatever questions to be asked, will be asked twice as there
// are two teams to which will need to answer a particular question
// by default this is set to `1`.
let number_of_times_asked = 1;


/**
 *     ============== END OF CONFIGURATIONS ================
 * ===================================================================
 * ===================================================================
 */





/**
 * Helps to style a dom element
 * @param {*} element the dom element to be styled
 * @param {*} styles an object whose keys are css properties and
 * values are parameters to be passed to the keys.
 */
function styleElement(element, styles){
	if(typeof(element) != "object"){
		return 0;
	}
	for (let i in styles){
		element.style[`${i}`] = `${styles[i]}`;
	}
}

/**
 * Helps to set a team name
 * @param {String} name represents the value of the name to be set
 * @param {Number} which_team represents the team to whose name is to be set
 */
function setTeamName(name, which_team){
	// As there are two teams in a football pitch, there is need to 
	// know which of the team's name is to be set.
	if (which_team === 1){
		teamOneName.innerHTML = name;
	}
	else{
		teamTwoName.innerHTML = name;
	}
}

/**
 * This helps to set a text as a question
 * @param {String} question_text text to be asked as question
 */
function setQuestionOnFormLabel(question_text){
	formLabel.textContent = question_text;
}

/**
 * Positions the question form, so that for question 1, the 
 * question form will be at the team 1 pitch portion and for 
 * question 2, the question form will be at the team 2 pitch 
 * portion
 */
function questionFormPositionLogic(){
	let xPos = 0;		
	if (number_of_times_asked === 1){
		// set the position on the team 1 pitch portion
		xPos = platformWrapXPos;	
	}
	else {
		// sets the position on team 2 pitch portion
		xPos = parseInt(formWrap.style.width) + platformWrapXPos
	}
	// rendering positioning
	positionFormWrapper(xPos, formWrapYPos);
}

/**
 * This helps to process the lifespan of a question form, it helps
 * to display the form while there are still questions to be asked
 * and removes it when there are no more question to be asked.
 * @param {String} question_text the text to be used as a question
 */
function questionProcessor(){
	// this check needs no happen because current question number
	// is what determines if the question form will be displayed 
	// or not
	if(number_of_times_asked === 2) {
		// only when a single question has been asked twice
		// can we proceed to the next question
		current_question += 1;
	}

	let question_text = '';

	if (number_of_times_asked === 1){
		question_text = GAME_QUESTIONS[current_question]
		// we're using `number_of_times_asked` to represent the team 
		// whose name is to be set. e.g
		// if number_of_times_asked = 1 :: then it's team one's name
		setTeamName(formInput.value, number_of_times_asked);
		setQuestionOnFormLabel(question_text);
		number_of_times_asked += 1;
	}

	else {
		question_text = GAME_QUESTIONS[current_question];
		// we're using `number_of_times_asked` to represent the team 
		// whose name is to be set. e.g
		// if number_of_times_asked = 2 :: then it's team two's name
		setTeamName(formInput.value, number_of_times_asked);
		setQuestionOnFormLabel(question_text);
		number_of_times_asked = 1;
	}

	// when the current question that is been asked is same as the 
	// total number of question available to be asked, then all 
	// questions have been asked so the form which is displaying 
	// questions should be removed from the view.
	if (current_question >= GAME_QUESTIONS.length){
		formWrap.style.display = 'none';
		// football simulation can commence.
		simulateMovingFootball();
	}

	formInput.value = '';
}

/**
 * combines form processing (question and answering) and rendering
 * of question form in a single function
 * @param {question_text} question_text text to be used as a question
 */
function processInput(){
	questionProcessor();
	questionFormPositionLogic();
}

/**
 * helps to update the vertical and horizontal position of 
 * the form
 * @param {Integer} x the new horizontal position value
 * @param {Integer} y the new vertical position value
 */
function positionFormWrapper(x, y){
	// the form is a div that is using an absolute positioning

	// the vertical position can be set using either the 
	// `top` or `bottom` css property which can be accessed through
	// `style component of the form's DOM element

	// the horizontal position can be set using either the
	// `left` or `right` css  property which can be accessed through
	// `style` component of the form's DOM element
	
	// Since x (horinzontal) positioning is calculated from
	// left to right, we'll be using the `left` property for 
	// horizontal positioning

	// Since y (vertical) positioning is calculated from
	// top to bottom, we'll be using the `top` property for
	// vertical positioning
	formWrap.style.left = `${x}px`;
	formWrap.style.top = `${y}px`;
}



/**
 * Draws the football pitch
 * @param {*} color the color of the pitch's field
 */
function drawPlayArea(color = '#317131') {
	canvas.style.backgroundColor = color;

	// draw left goal
	goalPost(leftGoalXPos, goalYPos, goalWidth, goalHeight);

	// draw right goal
	goalPost(rightGoalXPos, goalYPos, goalWidth, goalHeight);

	// draw lower side line
	drawXSideLine((y = bottomSideLine), (color = '#ffffff'));

	// draw upper side line
	drawXSideLine(); // uses the default values

	// draw left side line
	drawYSideLine(); // uses the default values

	// draw right side line
	drawYSideLine((x = rightSideLine));

	// draw center component
	drawCenterComponent();

	// draw football
	drawFootball();

	// takes the place of setInterval but better than it as it quickly
	// re-renders component to be drawn on a canvas
	requestAnimationFrame(drawPlayArea);
}

/**
 * draws a goal post
 * @param {Number} x the horizontal position where drawing will begin
 * @param {Number} y the vertical postion where drawing will begin
 * @param {Number} weight the width of the object
 * @param {Number} height the height of the object
 * @param {String} color the color of the object default to white
 */
function goalPost(x, y, width, height, color = '#ffffff') {
	context.beginPath();
	context.strokeStyle = color;
	context.lineWidth = 2;
	context.strokeRect(x, y, width, height);
	context.closePath();
	context.stroke();
}

/**
 * draws the horizontal sideline of a field, which in football vanacular is
 * called throwing line
 * @param {Number} y defines the vertical position of the object
 * @param {String} color initializes the color of the object, default to white
 */
function drawXSideLine(y = padSideline, color = '#ffffff') {
	context.beginPath();
	context.strokeStyle = color;
	context.lineWidth = 1;
	context.strokeRect(0, y, canvas.width, 1);
	context.closePath();
	context.stroke();
}

/**
 * draws the vertical sideline of a field, which in football vancular is called
 * corner kick line.
 * @param {Number} x defines the horizontal position of the object
 * @param {String} color initializes the color of the object, default to white
 */
function drawYSideLine(x = padSideline, color = '#ffffff') {
	context.beginPath();
	context.strokeStyle = color;
	context.lineWidth = 1;
	context.strokeRect(x, 0, 0, canvas.height);
	context.closePath();
	context.stroke();
}

/**
 * draws the center components of a football field, which is basically
 * the vertical straight line that divides opponents position and the
 * big round circle.
 */
function drawCenterComponent() {
	let midXPos = canvas.width / 2;
	let midYPos = canvas.height / 2;

	// drawing center line
	context.beginPath();
	context.strokeStyle = '#ffffff';
	context.lineWidth = 1;
	context.strokeRect(midXPos, 0, 0.8, canvas.height);
	context.closePath();
	context.stroke();

	// draw the large circle
	let radius = 70;
	context.beginPath();
	context.strokeStyle = '#ffffff';
	context.lineWidth = 3;
	context.arc(midXPos, midYPos, radius, 0, 2 * Math.PI, false);
	context.stroke();
}

/**
 * draws a ball object with the specified x and y position.
 * @param {Number} x defines the horizontal position of ball object
 * @param {Number} y defines the vertical position of ball object
 */
function drawFootball(x = footballXPos, y = footballYPos) {
	context.beginPath();
	context.fillStyle = '#30abb1';
	// the size of a ball is fixed as the specified radius is 6
	context.arc(x, y, 6, 0, Math.PI * 2, true);
	context.fill();

	context.strokeStyle = '#cddc00';
	context.lineWidth = 0.5;
	context.stroke();
	context.closePath();
}

/**
 * moves ball to a new position and clears the previous position of
 * ball
 * @param {Number} x defines the horizontal position to move a ball to
 * @param {Number} y defines the vertical position to move a ball to
 */
function moveFootball(x, y) {
	footballYPos = y;
	footballXPos = x;
	context.clearRect(0, 0, canvas.width, canvas.height);
	drawFootball(x, y);
}

/**
 * displays information about the activity in a match
 * @param {String} message information to be displayed
 */
function displayMessage(message) {
	context.font = '24px serif';
	context.fillStyle = '#ff7600';
	context.fillText(message, messageXPos, messageYPos);
}

/**
 * checks if there is a throwin. Throwin occurs when a ball goes
 * beyond the vertical lines.
 */
function checkThrowIn() {
	// we'll only be checking for vertical position of the football
	if (footballYPos < padSideline || footballYPos > bottomSideLine) {
		displayMessage('Throw In');
		simulationIntervalFlag = false;
		setTimeout(() => {
			simulationIntervalFlag = true;
		}, 3000);
	}
}

/**
 * checks if there is a corner kick. Corner Kick occurs when a ball goes
 * beyond the horizontal lines.
 */
function checkCornerKick() {
	// we'll only be checking for vertical position of the football
	if (footballXPos < padSideline || footballXPos > rightSideLine) {
		displayMessage('Corner');

		// set to true so that Goal scored will not be displayed, when
		// the ball position for corner kick is same/relative as the goal post
		// position. A ball can go over the bar, to be a corner kick, that doesn't
		// me it's a goal scored
		isCorner = true;
		simulationIntervalFlag = false;
		setTimeout(() => {
			simulationIntervalFlag = true;
		}, 3000);
	}
}

/**
 * Checks the team that has scored a goal and returns a representing
 * value
 * 
 * @returns {String} : a representing value for team that has scored 
 * a goal. It can only be one amongst these two values ("one", "two")
 */
function teamThatScoredGoal(){
	// when a team scores a goal, it means the ball will be in it's
	// opponent position

	// the simulating football have a tracker that tracks it's current
	// position on the field.

	// split the field by two (one side each for a team)
	let splitedFieldWidth = canvas.width / 2

	// if the football's current position is greater than the `splittedFieldWidth`
	// then it means it's team 1 that has scored a goal, else it is team two that
	// has scored a goal

	if (footballXPos > splitedFieldWidth){
		return "one";
	}

	return "two";
}

function incrementTeamNumberOfGoals(){
	// retrieve the team that scored representing value
	let teamRepresentingValue = teamThatScoredGoal();

	// compute the full details of the team that scored
	let teamThatScored = `team_${teamRepresentingValue}_goals`;

	// retrieve the DOM element within which the value of goal scored tracked
	let currentGoalValueDOM = document.querySelector(`.${teamThatScored}`);

	// get current value of goal scored
	let currentAmountOfGoalScored = currentGoalValueDOM.textContent;

	// increment the current goal scored by one and set it to it's holder
	currentAmountOfGoalScored = parseInt(currentAmountOfGoalScored) + 1;

	currentGoalValueDOM.textContent = currentAmountOfGoalScored;
}

function checkGoalScore() {
	// we'll only be checking for horizontal position relative to the
	// vertical space covered by the goal post

	// to compute a score we'll need to check if the ball is within the
	// vertical start position of the goal post and the vertical end
	// position of the goal post

	// both (left & right) have same vertical start and  vertical end
	// position
	let goalVerticalStartPosition = goalYPos;
	let goalVerticalEndPosition = goalYPos + goalHeight;

	// we also need to get the width of a goal post, as we only want to
	// record a goal when the ball passes the first vertical bar of the
	// goal post within the field area

	// we'll need the start and end position also

	// for left goal post
	let leftGoalHorizontalStartPosition = 0; // left
	let leftGoalHorizontalEndPosition = goalWidth; // to right

	// for right goal post
	let rightGoalHorizontalStartPosition = rightGoalXPos; // left
	let rightGoalHorizontalEndPosition = rightGoalXPos + goalWidth; // to right

	if (
		(footballXPos >= leftGoalHorizontalStartPosition &&
			footballXPos <= leftGoalHorizontalEndPosition) ||
		(footballXPos >= rightGoalHorizontalStartPosition &&
			footballXPos <= rightGoalHorizontalEndPosition)
	) {
		// if the above check passes, it means the football within the vertical width range of either the
		// left goal post or the right goal post
		if (
			footballYPos >= goalVerticalStartPosition &&
			footballYPos <= goalVerticalEndPosition
		) {
			// if the above check passes, it means football is within the length
			// of a goal post
			if (isCorner != true) {
				// if the the above check passes, it means the football did not go above the
				// goal post that would make it to be a corner kick instead of goal scored.
				displayMessage('Goal Scored');

				// calculate and increment the number of goals for the team that has scored
				incrementTeamNumberOfGoals();

				// pause simulation for a while
				simulationIntervalFlag = false;
				setTimeout(() => {
					simulationIntervalFlag = true;
				}, 3000);
			}
		}
	}
}

/**
 * randomly move football to a new position, which makes it
 * looks like it's being played.
 */
function simulateMovingFootball() {
	let newXPos, newYPos;
	setInterval(() => {
		if (simulationIntervalFlag === true) {
			newXPos = Math.floor(Math.random() * canvas.width);
			newYPos = Math.floor(Math.random() * canvas.height);

			/***
			 * ********
			 * ************
			 * TESTING GOAL SCORED USING FIXED FOOTBALL POSITIONING
			 * 
			 */

			// only uncomment the below newXPos and newYPos if you want to
			// check that the goalScore functionality works

			// test goalScore functionality for left goal post

			// newXPos = 10;
			// newYPos = goalYPos + 8;

			// test goalScore functionality for right goal post

			// newXPos = rightGoalXPos + 5;
			// newYPos = goalYPos + 8;

			/***
			 * ********
			 * ************
			 * TESTING CORNER KICK USING FIXED FOOTBALL POSITIONING
			 * 
			 */
			// test that corner is displayed wen the ball goes beyond
			// the same position of the goal post, in cases when the ball
			// goes beyond the bar (goal post bar), it shouldn't be calculated
			// as a goal scored

			// test that for left goal post

			// newXPos = 1;
			// newYPos = goalYPos + 8;

			// test for right goal post
			// newXPos = rightGoalXPos + 15;
			// newYPos = goalYPos + 8;

			moveFootball(newXPos, newYPos);
			checkThrowIn();
			checkCornerKick();
			checkGoalScore();

			// as corner kick has been played already, should in case
			// there was any during simulation.
			// this variable can only be set to true within the
			// checkCornerKick() function, and is a global variable.
			isCorner = false;
		}
	}, 1500);
}

function mainApp() {
	/** first we'll have to draw the pitch which is the playing area */
	drawPlayArea();

	// position form
	positionFormWrapper(platformWrapXPos, formWrapYPos);

	// event definition & handler for question form submit button
	formSubmitBtn.addEventListener('click', function(){
		processInput();
	});
}


// main app should run
mainApp();