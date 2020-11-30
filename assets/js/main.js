/*
Typing Speed Test
Author: Ibrahim Sharaf

Email: ibrahimsharaf@gmail.com
WhatsApp: +249993712130 -> WhatsApp only.
*/

// delete this
a = console.log;

const correct = "correct";
const wrong   = "wrong"; 
const skipped = "skipped";


const test_duration = 60;
const emptyString   = "";
const Backspace     = "Backspace";
const Space         = " ";

class Select {
	constructor(element) {
		
		this.element   = this._select(element);
		this.classList = this.element.classList;
	}

	_select(element) {

		if(typeof element == "object") return element;
		return document.querySelector(element);
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

	_addEvent(evName, func) {
		this.element.addEventListener(evName, func);
		return this;
	}

	onClick(func) {
		this._addEvent('click', func);
		return this;
	}

	onKeydown(func) {
		this._addEvent('keydown', func);
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

	addText(text) {
		var nodeName = this.element.nodeName.toLowerCase();
		if(nodeName == "input" || nodeName == "textarea") {
			if (text === undefined) return this.element.value;
			this.element.value += text;
		} else {
			if(text === undefined) return this.element.innerText;
			this.element.innerText += text;
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

	create(nodeName) {
		let node = document.createElement(nodeName);
		return G(node);
	}

	append(node) {
		if(typeof node !== "object") {
			node = this.create(node);
		}

		this.element.appendChild(node.element);
		return G(node);
	}

	insert(node, element) {
		this.element.insertBefore(node, element);
		return this;
	}
}

class WordsStack {

	constructor() {
		this.wordsStack = [];
		this.length     = 0;
	}

	push(word) {
		this.wordsStack.push(word);
		this.length += 1;
	}

	pop() {
		let deleted = this.wordsStack.pop();
		this.length -= 1;
		return deleted;
	}
}

class Word {
	constructor(writtenWord, correctWord) {

		this.written  = writtenWord;
		this.correct  = correctWord;
		this.state = this._getState(); 
	}

	_getState() {

		if( this._isCorrect() ) {
			return correct;
		} 

		else if( this._isSkipped ) {
			return skipped;
		}

		return wrong;
	}

	_isCorrect() {
		return (this.written === this.correct);
	}

	_skipped() {
		return (this.written === emptyString);
	}
}


class Statistics {
	constructor(wordsStack, testDuration) {
		this.wordsStack     = wordsStack;
		this.testDuration   = testDuration;
		this.startTime      = null;
		this.time           = 0;
		this.resCPM         = 0;
		this.theLoop  		= null;
		this.resWPM         = 0;
		this.timeElement 	= G("#time");
		this.wpmElement 	= G("#wpm");
		this.cpm 			= G("#cpm");
	}

	start() {
		this.startTime = this.getTimeNow();
		this.theLoop = setInterval(this.update.bind(this), 500);

	}

	end() {
		if(this.time > this.testDuration) {
			clearInterval(this.theLoop);
		}
	}

	update() {
		console.log("WE are here")
		if(this.time > 0) {
			console.log("WE are here")
		}
	}

	calcCPM() {

	}

	calcWPM() {

	}

	getTimeNow() {
		return ~~(Date.now() / 1000);
	}

	getTimeLeft() {
		if(this.time <= this.testDuration) {
			return this.testDuration - this.time;
		}; return 0;
	}

	updateTime() {
		// update time
	}

	isEnded() {
		return (this.time >= this.testDuration);
	}
}

class Text {

	constructor(testText, wordsStack) {

		this.wordsStack      = wordsStack.wordsStack;
		this.testText        = testText;
		this.length          = this.testText.length;
		this.current         = 0;
		this.testextCopy     = [...this.testText];
		this.toTypeArea      = G("#toTypeArea");
		this.currentElement  = this.testextCopy[this.current];
		this.currentWord     = this.testText[this.current];
		this.currentWordCopy = [...this.currentWord];
		this.word            = null;
		this.lineHeight 	 = 0;
		this.lToScroll 		 = 2; // Line to scroll at.
		this.hToScroll 		 = 0; // Hieght to scroll to.
		this.y         		 = 0;
		this.addHtml();
		this.update();
		this.currentEl = G('.current').element;
		this.offsetT_f = this.currentEl.offsetTop;
		this.offsetT_s = this.currentEl.offsetTop;
		this.notFounded= true;
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
		this.offsetT_s = this.currentEl.offsetTop;
		if(this.notFounded && this.offsetT_s > this.offsetT_f ) {
			this.lineHeight  = this.offsetT_s - this.offsetT_f;
			this.hToScroll   = this.lineHeight * this.lToScroll;
			this.notFounded  = false;
		}
	}

	update() {
		this.doCurrent();
		this.currentEl = G('.current').element
		this.scroll();
	}

	doCurrent() { 
		this.currentElement  = this.testextCopy[this.current];
		this.currentWord     = this.testText[this.current]; 
		this.currentWordCopy = [...this.currentWord];

		this.testextCopy[this.current].changeClass("current");

		let node;
		this.currentElement.text("");
		for(let i=0; i < this.currentWord.length; i++) {


			node = this.currentElement.create("span")
			                   .text(this.currentWord[i]);
			
			this.currentWordCopy[i] = node;
			this.currentElement.append(node);
		}
	}

	advance() {
		this.word       = this.wordsStack[this.current];
		let currentSpan = this.testextCopy[this.current];
		currentSpan.changeClass(this.word.state);
		currentSpan.text(this.currentWord);
		this.current++;
	}

	recede() {
		let currentSpan = this.testextCopy[this.current];
		if(this.current > 0) {
			currentSpan.removeClass("current");
			currentSpan.text(this.currentWord);

			this.current--;
		}
	}

	addHtml() {
		let node;
		for(let i=0; i<this.length; i++) {
			node = this.toTypeArea.create("span")
			           .text(this.testText[i]);

			this.testextCopy[i] = node;
				
			this.toTypeArea.append(node)
		}
	}

	start() {
		this.toTypeArea.html(this.testText.join(" "));
	}
}


class TypingTest {

	constructor(textToType, testDuration) {

		this.text       = this._shuffle(this._toArray(text));
		this.wordsStack  = new WordsStack();
		this.inputField = G("#inputField");
		this.notStarted = true;
		this.statistics = new Statistics(this.wordsStack, testDuration);
		this.index      = 0;
		this.read       = new Text(this.text, this.wordsStack);

		this.inputField.onKeydown(this.inputKeydownHandler.bind(this));
	}

	start() {
		if(this.notStarted) {
			this.notStarted = false;
			this.statistics.start();
		}
	}

	advance() {
		this.index++;
	}

	recede() {
		this.index? this.index--: 0;
	}

	deleteWord() {
		let words = this.wordsStack;
		this.setCurrent(words.length?words.pop().written + Space :emptyString);
		this.recede();
		this.read.recede();
		this.read.update();
	}

	_shuffle(arr) {
		return arr.sort(()=> - Math.round(Math.random()));
	}

	_toArray(text) {
		return text.split(/\s+/);
	}

	current() {
		return this.inputField.text();
	}

	setCurrent(text) {
		this.inputField.text(text);
		return this;
	}


	addWord(writtenWord) {
		this.setCurrent("");
		let givenWord = this.text[this.index];
		let word = new Word(writtenWord, givenWord);
		this.wordsStack.push(word);
		this.advance();
		this.read.advance(word);
		this.read.update(word);
	}

	inputKeydownHandler(ev) {

		if(ev.key == Backspace && this.current() == emptyString) {
			this.deleteWord();
		}

		else if(ev.key == Space && this.current().trim() !== emptyString) {
			ev.returnValue = false;
			this.addWord(this.current());
		}
	}
}

// and how it;s possble to make something like that we are 
//  qw are here to make the mpossible and when

// var wordsStack = [];
// var pos = 0;

// inputText.onKeyDown(function(e) {
// 	console.log(e.key);
// 	var text = inputText.text();
// 	if (e.key == " " && text.trim() != "") {
// 		e.returnValue = false;
// 		wordsStack.push(text);
// 		inputText.text("");
// 		pos++;
// 	}

// 	else if (e.key == "Backspace" &&!text && pos !== 0) {
// 		pos--
// 		inputText.text(wordsStack[pos]+" ");
// 	}

// 	else if (e.key == "Enter") {
// 		alert("you pressed inter pleace use spacebar instead of Enter")
// 	}
// })



// setInterval(function() {
// 	console.log("worked");
// },100) 



function G(element) {
	return new Select(element);
}


let text = 
'the name of very to through and just form in much is great it think you say ' +
'that help he low was line for before on turn are cause with same as mean ' +
'differ his move they right be boy at old one too have does this tell from ' +
'sentence or set had three by want hot air but well some also what play there ' +
'small we end can put out home other read were hand all port your large when ' +
'spell up add use even word land how here said must an big each high she such ' +
'which follow do act their why time ask if men will change way went about light ' +
'many kind then off them need would house write picture like try so us these ' +
'again her animal long point make mother thing world see near him build two self ' +
'has earth look father more head day stand could own go page come should did ' +
'country my found sound answer no school most grow number study who still over ' +
'learn know plant water cover than food call sun first four people thought may ' +
'let down keep side eye been never now last find door any between new city work ' +
'tree part cross take since get hard place start made might live story where saw ' +
'after far back sea little draw only left round late man run year don\'t came ' +
'while show press every close good night me real give life our few under stop ' +
'open ten seem simple together several next vowel white toward children war ' +
'begin lay got against walk pattern example slow ease center paper love often ' +
'person always money music serve those appear both road mark map book science ' +
'letter rule until govern mile pull river cold car notice feet voice care fall ' +
'second power group town carry fine took certain rain fly eat unit room lead ' +
'friend cry began dark idea machine fish note mountain wait north plan once ' +
'figure base star hear box horse noun cut field sure rest watch correct color ' +
'able face pound wood done main beauty enough drive plain stood girl contain ' +
'usual front young teach ready week above final ever gave red green list oh ' +
'though quick feel develop talk sleep bird warm soon free body minute dog strong ' +
'family special direct mind pose behind leave clear song tail measure produce ' +
'state fact product street black inch short lot numeral nothing class course ' +
'wind stay question wheel happen full complete force ship blue area object half ' +
'decide rock surface order deep fire moon south island problem foot piece yet ' +
'told busy knew test pass record farm boat top common whole gold king possible ' +
'size plane heard age best dry hour wonder better laugh true thousand during ago ' +
'hundred ran am check remember game step shape early yes hold hot west miss ' +
'ground brought interest heat reach snow fast bed five bring sing sit listen ' +
'perhaps six fill table east travel weight less language morning among speed ' +
'typing mineral seven eight nine everything something standard distant paint'
;


let typingTest = new TypingTest(text, test_duration);