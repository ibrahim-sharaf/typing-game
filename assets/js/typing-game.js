
/********************************************************************************
 *                             Typing Speed Test                                *
 *                                                                              *
 *                           Author: Ibrahim Sharaf.                            *
 *                                                                              *
 ********************************************************************************/


const Backspace   = 'Backspace';
const Space 	  = " ";
const emptyString = "";


class Select {
	
	constructor(element) {
		this.elName    = element;
		this.element   = this._select(element);
		this.classList = this.element.classList;
	}

	_select(element) {

		if(typeof element == "object") return element;
		let el = document.querySelector(element);
		if(el == null) {
			throw `Element ${this.elName} not found`;
		}
		return el;
		 
	}

	hide() {
		this.element.style.display = "none";
		return this;
	}

	show() {
		this.element.style.display = "block";
		return this;
	}

	showAs(display) {
		this.element.style.display = display;
		return this;
	}

	toggle() {

		if(this.element.style.display == "none") {
			this.show()
		} else {
			this.hide();
		}

		return this;
	}

	toggleAs(display) {

		if(this.element.style.display == "none") {
			this.showAs(display)
		} else {
			this.hide();
		}

		return this;
	}

	disable() {
		this.element.disabled = true;
		return this;
	}

	activate() {
		this.element.disabled = false;
		return this;
	}

	_addEvent(evName, func) {
		this.element.addEventListener(evName, func);
		return this;
	}

	_removeEvent(evName, func) {
		this.element.removeEventListener(evName, func);
		return this;
	}

	onClick(func) {
		this._addEvent('click', func);
		return this;
	}
	removeOnClick(func) {
		this._removeEvent('click', func);
		return this;
	}

	onKeydown(func) {
		this._addEvent('keydown', func);
		return this;
	}

	removeOnKeyDown(func) {
		this._removeEvent('keydown', func);
		return this;
	}

	onKeypress(func) {
		this._addEvent('keypress', func);
		return this;
	}

	removeOnKeyPress(func) {
		this._removeEvent('keypress', func);
		return this;
	}

	onKeyUp(func) {
		this._addEvent('keyup', func);
		return this;
	}

	removeOnKeyUp(func) {
		this._removeEvent('keyup', func);
		return this;
	}

	onChange(func) {
		this._addEvent('onchange', func);
		return this;
	}

	removeOnChange(func) {
		this._removeEvent('onchange', func);
		return this;
	}

	text(text) {
		var nodeName = this.element.nodeName.toLowerCase();
		if(nodeName == "input" || nodeName == "textarea") {
			if (text === undefined) return this.element.value;
			this.element.value = text;
		} else {
			if(text === undefined) return this.element.innerText;
			this.element.innerText = text;
		}

		return this;
	}

	html(html) {
		this.element.innerHTML = html;
		return this;
	}

	addHtml(html) {
		this.element.innerHTML += html;
		return this;
	}

	addClass(className) {
		this.classList.add(className);
		return this;
	}

	changeClass(className) {
		this.element.className = className;
		return this;
	}

	removeClass(className) {
		this.classList.remove(className);
		return this;
	}

	emptyClasses() {
		this.element.className = emptyString;
		return this;
	}

	classExist(className) {
		return this.classList.contains(className);
	}

	replaceClass(firstClass, secondClass) {
		this.classList.replace(firstClass, secondClass);
		return this;
	}

	toggleClasses(firstClass, secondClass) {
		if(this.classExist(firstClass)) {
			this.replaceClass(firstClass, secondClass);
		} else {
			this.replaceClass(secondClass, firstClass);
		}

		return this;
	}

	create(nodeName) {
		let node = document.createElement(nodeName);
		return node;
	}

	append(node) {
		if(typeof node !== "object") {
			node = this.create(node);
		}

		this.element.appendChild(node);
		return G(node);
	}

	insert(node, element) {
		this.element.insertBefore(node, element);
		return this;
	}

	parent() {
		return G(this.element.parentElement);
	}
}


class WordsStack {

	constructor() {
		this.wordsStack   		= [];
		this.correctWords 		= [];
		this.numOfCorrectChars	= 0;
		this.length				= 0;
	}

	push(word) {
		this.wordsStack.push(word);
		this.length++
		if(word.isCorrect()) {
			this.correctWords.push(word);
			this.numOfCorrectChars += word.length + 1;
		}

	}

	pop() {
		let deleted;
		if(this.length) {
			deleted = this.wordsStack.pop();
			this.length--
			if(deleted.isCorrect()) {
				this.correctWords.pop();
				this.numOfCorrectChars -= deleted.length - 1;
			}
			return deleted;
		}
	}
}

class Word {
	constructor(writtenWord, correctWord) {
		this.written = writtenWord;
		this.correct = correctWord;
		this.length  = this.written.length;
		this.state   = this._getState();
	}

	_getState() {
		if(this.isCorrect()) {
			return "correct";
		}

		else if(this.isSkipped()){
			return "skipped";
		}

		return "wrong";
	}

	isCorrect() {
		return (this.written === this.correct);
	}

	isSkipped() {
		return (this.written === emptyString) 
	}
}

class Result {

	constructor(statistics) {
		this.statistics 	= statistics;
		this.wrongWords		= [];
		this.render();
	}

	getWrongWords() {
		for (let word of this.statistics.wordsStack.wordsStack) {
			if(!word.isCorrect()) this.wrongWords.push(word);
		}
	}

	render() {
		G('#resModel').show();

		let resCPM        = document.querySelectorAll(".res-cpm");
		let resWPM        = document.querySelectorAll(".res-wpm");
		let resAccuracy   = document.querySelectorAll(".res-accuracy");
		let resTypedWords = document.querySelectorAll(".res-typed-words");

		resCPM.forEach(a=>G(a).text(this.statistics.getCPM()));
		resWPM.forEach(a=>G(a).text(this.statistics.getWPM()));
		resAccuracy.forEach(a=>G(a).text(this.statistics.accuracy));
		resTypedWords.forEach(a=>G(a).text(this.statistics.wordsStack.length));

		this.buildMistakesTable();
	}

	buildMistakesTable() {


		this.getWrongWords()

		let numOfMistakes = this.wrongWords.length;
		let mistakesText;

		if(numOfMistakes) {
			mistakesText = (numOfMistakes > 1)
						 ? `You made ${numOfMistakes} mistakes`
						 : `You made one mistake`;

			G("#numOfMistakes").text(mistakesText);
		}
		
		if(this.wrongWords.length <= 0) {
			G("#footer").hide();
		}

		let mistakesTable = G("#mistakesTable");

		this.wrongWords.forEach((word)=> {
			if(word.state === 'skipped') {word.written = "'_'"};
			let row = mistakesTable.append('div');
			row.addClass('row');
			row.append('div').changeClass("col-sm-4 col").text(word.written);
			row.append('div').changeClass("col-sm-4 col").text(word.correct);
			row.append('div').changeClass("col-sm-4 col").text(word.state);
		})

	}
}

class Statistics {

	constructor(wordsStack, testDuartion) {

		this.wordsStack 	  = wordsStack;
		this.testDuartion 	  = testDuartion;
		this.theLoop 		  = null;
		this.animationSpeed   = 500;
		this.startTime  	  = null;
		this.time 		 	  = null;
		this.notStarted       = true;
		this.timeElement 	  = G("#time");
		this.wpmElement 	  = G('#wpm');
		this.cpmElement 	  = G('#cpm');
		this.accuracy		  = null;
		this.notFinished	  = true;
	}

	start() {
		if(this.notStarted) {
			this.notStarted = false;
			this.startTime 	= this.getTimeNow();
			this.theLoop 	= setInterval(this.update.bind(this), this.animationSpeed);
		}
	}

	end() {
		clearInterval(this.theLoop);
		this.getAccuracy();
		let result = new Result(this);
	}

	getAccuracy() {
		this.accuracy = Math.round(100 * (this.wordsStack.correctWords.length/this.wordsStack.length));
	}

	update() {
		this.time = this.getTime();
		if(this.time < this.testDuartion) {
			this.timeElement.text(this.testDuartion - this.time);
		} else if(this.notFinished){
			this.notFinished = false;
		}
		
		if (this.time > 0) {
			this.cpmElement.text(this.getCPM());
			this.wpmElement.text(this.getWPM());
		}
	}

	getCPM() {
		return Math.round((this.wordsStack.numOfCorrectChars * 60)/this.time)
	}

	getWPM() {
		return Math.round((this.getCPM()/5));
	}

	getTime() {
		return (this.getTimeNow() - this.startTime);
	}

	getTimeNow() {
		return ~~(Date.now()/1000)
	}

	isEnded() {
		return (this.time >= this.testDuartion);
	}
}

class ToTypeArea {

	constructor(testText, wordsStack) {

		this.testText    	= testText;
		this.testTextHtml   = [];
		this.wordsStack  	= wordsStack;
		this.toTypeArea  	= G("#toTypeArea");
		this.index 			= 0;
		this.currentWordEl	= null;
		this.prevWord		= null;
		this.currentWord 	= testText[this.index];
		this.lineHeight 	= 0;
		this.lToScroll 		= 2; // Line to scroll at.
		this.hToScroll 		= 0; // Height to scroll to.
		this.y         		= 0;
		this.offsetT_f 		= null;
		this.offsetT_s 		= null;
		this.notFounded		= true;
	}

	scroll() {
		this.findLineHeight();
		if (this.offsetT_s > this.hToScroll) {
			this.y += this.lineHeight;
			this.hToScroll += this.lineHeight;
			this.toTypeArea.element.scroll({top: this.y,behavior:'smooth'})
		}
		if ((this.offsetT_s - this.y) <= 15) {
			this.y -= this.lineHeight;
			this.hToScroll -= this.lineHeight;
			this.toTypeArea.element.scroll({top: this.y,behavior:'smooth'})
		}
	}

	findLineHeight() {
		this.offsetT_s = this.currentWordEl.element.offsetTop;
		if(this.notFounded && this.offsetT_s > this.offsetT_f ) {
			this.lineHeight  = this.offsetT_s - this.offsetT_f;
			this.hToScroll   = this.lineHeight * this.lToScroll;
			this.notFounded  = false;
		}
	}

	moveForward() {
		this.prevWord = this.wordsStack[this.index];
		this.index++;
		this.currentWordEl.changeClass(this.prevWord.state).html(this.currentWord);
		this.update();
	}

	moveBackward() {
		this.currentWordEl.emptyClasses().html(this.currentWord);
		this.index--;
		this.update();
	}

	update() {
		this.currentWord 	= this.testText[this.index];
		this.currentWordEl  = this.testTextHtml[this.index];
		this.currentWordEl.changeClass("current");
		this.scroll();
	}

	doCurrent(current) {
		let html = "";
		let correct, written;
		for(var i=0; i< current.length; i++) {
			correct = this.currentWord[i];
			written = current[i];
			if(i >= this.currentWord.length) {
				break
			}
			else if(written === correct) {
				html += `<span class="correct">${correct}</span>`
			} else {
				html += `<span class="wrong">${correct}</span>`
			}
		}
		if(current.length > this.currentWord.length) {this.currentWordEl.addClass("wrong")}
		this.currentWordEl.html(html+this.currentWord.substr(i));
	}

	initialize() {
		this.toTypeArea.text("");
		this.addHtml();
		this.offsetT_f 		= this.currentWordEl.element.offsetTop;
		this.offsetT_s 		= this.currentWordEl.element.offsetTop;
	}

	addHtml() {
		let node;
		for (let i in this.testText) {
			node = G(this.toTypeArea.create("span"))
			                      .text(this.testText[i]);
			this.toTypeArea.append(node.element);
			this.testTextHtml[i] = node;
		}
		this.currentWordEl = this.testTextHtml[this.index];
		this.currentWordEl.changeClass("current");
	}
}

class TypingTest {

	constructor(testText, testDuartion) {
		this.testText    = this.shuffle(this.toArray(testText));
		this.wordsStack  = new WordsStack();
		this.toTypeArea  = new ToTypeArea(this.testText, this.wordsStack.wordsStack);
		this.statistics  = new Statistics(this.wordsStack, testDuartion);
		this.inputField  = G('#inputField');
		this.notStarted  = true;
		this.index 		 = 0;
		this.currentWord = this.testText[this.index];

		this.handleInputListener = this.handleInput.bind(this);
		this.doCurrentListener   = this.doCurrent.bind(this);

		this.inputField.onKeydown(this.handleInputListener);
		this.inputField.onKeyUp(this.doCurrentListener);
		

	}

	doCurrent() {

		let current = this.inputField.text();
		this.toTypeArea.doCurrent(current);
	}

	handleInput(ev) {
		let inputText = this.inputField.text();

		if (ev.key === Space && inputText.trim() !== emptyString) {
			ev.returnValue = false;
			this.addWord(inputText);
			this.inputField.text("");
		}

		else if(ev.key === Backspace && this.inputField.text() === emptyString) {
			this.inputField.text(this.deleteWord());
		}

	}

	advance() {
		this.index++;
		this.toTypeArea.moveForward();
		this.currentWord = this.testText[this.index];
	}

	peek(n) {
		return this.testText[this.index + n];
	}

	push(written, correct) {
		let wordToAdd = new Word(written, correct);
		this.wordsStack.push(wordToAdd);
		this.advance();
	}

	addWord(word) {

		if(word !== this.currentWord) {
			if (word == this.peek(1)) {
				this.push(emptyString, this.currentWord)
			}

			else if (word == this.peek(2)) {
				this.push(emptyString, this.currentWord);
				this.push(emptyString, this.currentWord);
			}
		}

		this.push(word, this.currentWord);

		if(this.statistics.isEnded()) {
			this.end();
		}
	}

	deleteWord() {
		let deleted;
		if(this.index > 0) {
			deleted = this.wordsStack.pop();
			this.toTypeArea.moveBackward();
			this.index--
			return deleted.written + Space;
		}
	}

	shuffle(arr) {
		return arr.sort(()=> - Math.round(Math.random()));
	}

	toArray(text) {
		return text.split(/\s+/);
	}

	initialize() {
		this.toTypeArea.initialize();
		this.inputField.activate();
		G("#time").text(0);
		G("#wpm").text(0);
		G("#cpm").text(0);

	}

	start() {
		if(this.notStarted) {
			this.notStarted = false;
			this.statistics.start();
		}
	}

	end() {
		this.inputField.disable();
		this.inputField.removeOnKeyDown(this.handleInputListener);
		this.inputField.removeOnKeyUp(this.doCurrentListener);
		this.statistics.end();
	}
}


function G(element) {return new Select(element)}; 

// list of random english word.
let text = "trip quirky confuse retire snail burst obeisant hat educate glow credit yellow puny zippy gather faint chilly scene worry attractive full wipe stocking frightened lick shoes adhesive cast use anxious harsh equable alert bare angry useless scatter noxious peel morning rob provide release expand cut needle juice strip dusty proud answer aromatic action beautiful property interest stupendous crack birds stereotyped mountainous crawl incredible bath roll forgetful open tie letter stiff melodic stupid wry befitting spy aspiring guard avoid combative tank physical room used past chase invent defeated smelly few spray aware frantic drunk committee last breezy hope engine bored book stone shade handsomely share ultra nation subsequent inquisitive wasteful decay reminiscent circle cooperative home rescue accessible pies distribution scrub disgusting hungry trick girl payment ambiguous request live rustic argument excuse sky foot pet remind toothsome pan quickest efficient teeth lunch placid caring tick tiny psychotic sedate rifle one impartial lopsided cable mind scintillating snakes unadvised stranger adjustment sharp comb lewd penitent permissible contain snow probable plane rambunctious flap kittens overt massive crook join painful painstaking blind handy sponge condemned whirl waiting lackadaisical abhorrent fasten brown yak boot boundless distinct bright sign malicious curved rebel maid weary stimulating clam melted type toothbrush naughty doubt deer replace nappy jaded damage victorious blade earsplitting mend harbor welcome tomatoes tremble reproduce weigh salty handle limping bottle bike military fanatical iron agree surprise race wiry yard memory soap majestic library program advertisement hushed deserted paltry historical trains juvenile unusual imperfect shiver capable man terrific reaction homely seat camp permit punch vanish laughable far settle elegant foamy arithmetic kill sticky jog hair numerous learn obnoxious unsuitable supply snake fetch scarce thirsty dream slim spoil spiky suggestion nippy launch pocket squealing naive guarded baseball tidy produce flower whimsical adamant filthy lace noiseless gaze unnatural hapless fly six";

var typingTest = new TypingTest(text, 60);
	
	typingTest.initialize();

	G("#inputField").onKeypress(function() {
		typingTest.start();
	})

/******************** Generl stuff  *********************/

let restratFunction = function() {
	// I am just going to reloat the whole page which is unnecessary.
	// Gonna fix this later 
	window.location.reload()
}

G("#exit").onClick(restratFunction);
G("#restart").onClick(restratFunction);

G("#moreDetails").showAs("none");

G('#more-details-btn').onClick(function() {
	G("#moreDetails").toggle();
	G(this).toggleClasses("fa-arrow-down", "fa-arrow-up");
	G('#winCardBody').element.scroll({
		top: G('#mistakesTable').element.offsetTop,
		behavior: 'smooth'
	});

})

