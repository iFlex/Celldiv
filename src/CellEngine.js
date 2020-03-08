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
	constructor() {
		this.listeners = {}
	}

	dispatch(context) {
		let listeners = this.listeners[context.event.type]
		for(let i in listeners){
			listeners[i](context)
		}
	}

	static findClosestCellAncestor(event) {
		var closest_ancestor = event.target;
		while((closest_ancestor.id === null || CELL_REGISTRY.get(closest_ancestor.id) === null) && closest_ancestor !== document.body) {
			closest_ancestor = (closest_ancestor.parentElement || closest_ancestor.parentNode);
		}

		if(closest_ancestor.id !== null) {
      var closestCell = CELL_REGISTRY.get(closest_ancestor.id);
      while(closestCell !== null && !(closestCell.isSubsystmEnabled('events') === true)) {
        closestCell = closestCell.getParent();
      } 

			return closestCell; 
		}
		return null;
	}

	static onEvent(event) {
		let cellTarget = CellEventManager.findClosestCellAncestor(event);
		let enrichedEvent = {"event":event,"cell":cellTarget}
		
		//ToDo: fix this as it's a dirty azz workaround
		CELL_EVENT_MANAGER.dispatch(enrichedEvent)
	}

	//very simplistic, needs revision
	addEventListener(event, func) {
		
		if(this.listeners[event] == null){
			this.listeners[event] = []
		}

		this.listeners[event].push(func)
	}

	removeEventListener(event, func) {

	}
}

let CELL_EVENT_MANAGER = new CellEventManager();

export class AbstractCell { 

  constructor(parentDOM) {
  	this.children = [null, null];
  	this._domref = document.createElement("div");
  	this._domref.style.overflow = "hidden";
    this._domref.style.whiteSpace = "nowrap";
  	this.parent = null;

  	parentDOM.appendChild(this._domref);
  	
  	this.id = CELL_REGISTRY.register(this);
  	this._domref.id = this.id;

    this.enabledSubsystems = {
      'events':false  
    }
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

  enableEvents(events) {
    this.enabledSubsystems['events'] = true;

  	for(let i in events){
  		this._domref.addEventListener(events[i], CellEventManager.onEvent);
  	}
  }

  disableEvents(events) {
    this.enabledSubsystems['events'] = false;

  	for(let i in events){
  		this._domref.removeEventListener(events[i], CellEventManager.onEvent);
  	}
  }

  isSubsystmEnabled(sys) {
    return this.enabledSubsystems[sys] === true;
  }

  resize(percentage) {
  	if(this.parent) {
  		this.parent.leftChild().snapToParent(percentage);
  		this.parent.rightChild().snapToParent(100 - percentage);
  	}
  }

  kill() {
  	if(this.parent) {
  		this.parent._domref.removeChild(this._domref);
  	}
  }

  getParent() {
    return this.parent;
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

  getLeafOffpring() {

  }
}

export class StemCell extends AbstractCell {
  
  constructor(mode, percentageSize, parent) {
  	super(parent.DOMref());

  	this.parent = parent;
  	this.percentageSize = percentageSize
  	this.mode = mode
  	this.snapToParent();
  }

  snapToParent(percentage) {
  	if(percentage != null) {
  		this.percentageSize = percentage;
  	}

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
}

export {CELL_REGISTRY, CELL_EVENT_MANAGER};