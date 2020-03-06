import {CELL_REGISTRY, ScreenCell, DivisionModes} from "./CellEngine.js"
let userInterface = new ScreenCell(20, document.body);

userInterface.divide(DivisionModes.VERTICAL, 90);
let buttonGroup = userInterface.leftChild();
let closeGroup  = userInterface.rightChild();

buttonGroup.divide(DivisionModes.VERTICAL, 50);
let horizontalGroup = buttonGroup.leftChild();
let verticalGroup   = buttonGroup.rightChild();

horizontalGroup.divide(DivisionModes.HORIZONTAl, 80);
verticalGroup.divide(DivisionModes.HORIZONTAl, 80);

horizontalGroup.rightChild().setContent("<p class='cell-content'>Horizontal Split</p>")
verticalGroup.rightChild().setContent("<p class='cell-content'>Vertical Split</p>")