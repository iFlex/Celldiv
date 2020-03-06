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

window.onkeypress = function(e){
	if(e.key == "q"){
		clear_tentative();
		if(split_mode == DivisionModes.HORIZONTAl){
			split_mode = DivisionModes.VERTICAL;
		} else {
			split_mode = DivisionModes.HORIZONTAl;
		}
		update_tentative();
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
	clear_tentative();
	update_tentative();
});

CELL_EVENT_MANAGER.addEventListener("mousemove", function(e){
	last_target = e.cell;
	update_tentative(calculate_ratio(e));
});

CELL_EVENT_MANAGER.addEventListener("click", function(e){
	//console.log(e);
	clear_tentative();
	e.cell.divide(split_mode, 50);
	last_target = e.cell.leftChild();
});

function new_screen_cell(){
	let sc = new ScreenCell(100, document.body);
	sc.enableEvents(["mouseenter","mousemove","click"])
}

function new_tentative_draw(){
	if(last_target != null){
		last_target.divide(split_mode, 50);
		tentative_left = last_target.leftChild();
		tentative_right = last_target.rightChild();

		tentative_left.disableEvents(["mouseenter","mousemove","click"])
		tentative_right.disableEvents(["mouseenter","mousemove","click"])
	}
}

function update_tentative(ratio) {
	if(ratio == null){
		ratio = 50;
	}

	if(tentative_left == null){
		new_tentative_draw(ratio);
	} else {
		tentative_left.resize(ratio);
		tentative_right.resize(100 - ratio);
	}
}

function clear_tentative(){
	if(tentative_left != null){
		tentative_left.kill();
		tentative_right.kill();

		tentative_left = null;
		tentative_right = null;
	}
}

function calculate_ratio(e){
	let ratio = (e.event.clientX/e.cell.DOMref().clientWidth)*100
	if(ratio < 0)
		return 0;
	if(ratio > 100)
		return 100;
	return ratio
}