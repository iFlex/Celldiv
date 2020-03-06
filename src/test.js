import {CELL_REGISTRY, ScreenCell, DivisionModes} from "./CellEngine.js"
let sc = new ScreenCell(100, document.body);
sc.enableEvents(["mouseenter","mousemove","click"])
sc.divide(DivisionModes.HORIZONTAL, 30);
sc.leftChild().divide(DivisionModes.VERTICAL, 25);
sc.leftChild().leftChild().divide(DivisionModes.VERTICAL, 25);
sc.leftChild().leftChild().leftChild().divide(DivisionModes.HORIZONTAL, 25);
sc.rightChild().divide(DivisionModes.HORIZONTAL,55);

sc.leftChild().leftChild().leftChild().leftChild().enableEvents(["mouseenter","mouseleave","mousemove"])
sc.leftChild().leftChild().leftChild().leftChild().setContent("<button class='cell-content'>cacat</button>");