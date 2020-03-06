export const DivisionModes = {
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal'
}

class CellRegistry {
	constructor(){
		this.registry = {}
		this.incrementalId = 0;
	}

	register(cell) {
		this.registry[this.incrementalId] = cell;
		let cellID = this.incrementalId;
		this.incrementalId++;

		return cellID;
	}

	get(id) {
		return this.registry[id];
	}

	getAllIds(){
		return Object.keys(this.registry);
	}
}

let CELL_REGISTRY = new CellRegistry();

class CellEventManager {
	constructor(){
		this.listeners = {}
	}

	onEvent(event) {
		//bubble up event untill lookup works
		console.log(event);
	}

	addEventListener(event, func) {
		
	}

	removeEventListener(event, func) {

	}
}

let EVENT_MANAGER = new CellEventManager();

export class AbstractCell { 

  constructor(parentDOM) {
  	this.children = [null, null];
  	this._domref = document.createElement("div");
  	this._domref.style.overflow = "hidden";
    this._domref.style.whiteSpace = "nowrap";
  	
  	parentDOM.appendChild(this._domref);
  	
  	this.id = CELL_REGISTRY.register(this);
  	this._domref.id = this.id;
  }

  divide(mode, percentageSize) {
  	this.children[0] = new StemCell(mode,      percentageSize,this);
  	this.children[1] = new StemCell(mode,100  - percentageSize,this);
  }
  
  DOMref(){
  	return this._domref;
  }

  child(idx){
  	return this.children[idx];
  }

  leftChild(){
  	return this.child(0);
  }

  rightChild(){
  	return this.child(1);
  }

  setContent(content){
  	this._domref.innerHTML = content;
  }

  clearContent(){
  	this._domref.innerHTML = "";
  }

  enableEvents(events){
  	for(let i in events){
  		console.log("Enabling:"+events[i])
  		this._domref.addEventListener(events[i], EVENT_MANAGER.onEvent);
  	}
  }

  disableEvents(events){
  	for(let i in events){
  		this._domref.removeEventListener(events[i], EVENT_MANAGER.onEvent);
  	}
  }
}

export class ScreenCell extends AbstractCell {
  
  constructor(height, parentDOM) {
  	super(parentDOM);

    this.height = height;
    this.snapToParent();
  }

  snapToParent() {
  	this._domref.style.width = '100%';
  	this._domref.style.height = this.height + '%';
  }

  kill() {

  }

  getLeafOffpring() {

  }
}

export class StemCell extends AbstractCell {
  
  constructor(mode, percentageSize, parent) {
  	super(parent.DOMref());

  	this.percentageSize = percentageSize
  	this.mode = mode
  	this.snapToParent();
  }

  snapToParent() {
  	if(this.mode === DivisionModes.VERTICAL) {
  		this.width = this.percentageSize;
  		this.height = 100;
  		this._domref.style.display = "inline-block";// *display: inline; zoom: 1; vertical-align: top;";
  	} else {
  		this.width = 100;
  		this.height = this.percentageSize;
  	}

  	this._domref.style.width = this.width + '%';
  	this._domref.style.height = this.height + '%';
  }

  getSize() {
  	return this.percentageSize
  }

  kill() {

  }
}

export {CELL_REGISTRY};