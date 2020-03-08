import {CELL_REGISTRY, CELL_EVENT_MANAGER, ScreenCell, DivisionModes} from "./CellEngine.js"
// let userInterface = new ScreenCell(20, document.body);

// userInterface.divide(DivisionModes.VERTICAL, 90);
// let buttonGroup = userInterface.leftChild();
// let closeGroup  = userInterface.rightChild();

// buttonGroup.divide(DivisionModes.VERTICAL, 50);
// let horizontalGroup = buttonGroup.leftChild();
// let verticalGroup   = buttonGroup.rightChild();

// horizontalGroup.divide(DivisionModes.HORIZONTAl, 80);
// verticalGroup.divide(DivisionModes.HORIZONTAl, 80);

// horizontalGroup.rightChild().setContent("<p class='cell-content'>Horizontal Split</p>")
// verticalGroup.rightChild().setContent("<p class='cell-content'>Vertical Split</p>")
var tentative_left = null;
var tentative_right = null;
var last_target = null
var split_mode = DivisionModes.HORIZONTAl;
var events = ["mouseenter","mousemove","click"];

window.onkeypress = function(e){
	if(e.key == "q"){
		clear_tentative_split();
		
		if(split_mode == DivisionModes.HORIZONTAl){
			split_mode = DivisionModes.VERTICAL;
		} else {
			split_mode = DivisionModes.HORIZONTAl;
		}

		draw_tentative_split();
	}

	if(e.key >= '1' && e.key <= '9'){
		if(last_target != null){
			last_target.resize(parseInt(e.key)*10);
		}
	}
	
	if(e.key == '+') {
		new_screen_cell();
	}
}

CELL_EVENT_MANAGER.addEventListener("mouseenter", function(e){
	last_target = e.cell;
	clear_tentative_split();
	draw_tentative_split(last_target);
});

CELL_EVENT_MANAGER.addEventListener("mousemove", function(e){
	last_target = e.cell;
	resize_tentative_split(e);
});

CELL_EVENT_MANAGER.addEventListener("click", function(e){
	clear_tentative_split();
	//e.cell.divide(split_mode, 50);
	//last_target = e.cell.leftChild();
});

function new_screen_cell(){
	let sc = new ScreenCell(100, document.body);
	sc.enableEvents(events)
}

function draw_tentative_split(target){
	clear_tentative_split();
	
	if(target != null) {
	 	target.divide(split_mode, 50);

	 	tentative_left = target.leftChild();
	 	tentative_right = target.rightChild();
	}
}

function resize_tentative_split(e){
	if(tentative_left !== null && tentative_right !== null) {
		let ratio = calculate_tentative_split_ratio(e);
		
		tentative_left.resize(ratio);
		tentative_right.resize(100 - ratio);
	}
}

function clear_tentative_split(){
	if(tentative_left !== null) {
		tentative_left.kill();
		tentative_left = null;
	}
	if(tentative_right !== null) {
		tentative_right.kill();
		tentative_right = null;
	}
}

function calculate_tentative_split_ratio(e){
	var ratio = 0
	if(split_mode == DivisionModes.VERTICAL) {
		ratio = 100 - (e.event.clientX/e.cell.DOMref().clientWidth)*100;
	} else {
		ratio = 100 - (e.event.clientY/e.cell.DOMref().clientHeight)*100;
	}
	
	if(ratio < 0)
		return 0;
	if(ratio > 100)
		return 100;
	return ratio
}