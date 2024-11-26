import { createGUID } from '../../../../shared/lib';
import Observable from '../../../../shared/lib/Observable';
import { ObjectGUID } from './PlaygroundModel';

export enum ICON_TYPE {
    CIRCLE = 'circle',
    SOURCE = 'source',
    RECEIVER = 'receiver'
}

function makeDraggable(elmnt: HTMLDivElement) {
    let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (elmnt) {
        // if present, the header is where you move the DIV from:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e: MouseEvent) {
        elmnt.classList.add('dragging');
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e: MouseEvent) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + 'px';
        elmnt.style.left = elmnt.offsetLeft - pos1 + 'px';
    }

    function closeDragElement() {
        elmnt.classList.remove('dragging');
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

export default class IPlaygroundObject extends Observable {
    public static SIGNALS = {
        POSITION_UPDATED: 'p_u'
    };
    public readonly position: { x: number; y: number } = { x: 0, y: 0 };
    public guid: ObjectGUID = createGUID();
    public icon: ICON_TYPE = ICON_TYPE.CIRCLE;
    private _domElement: HTMLElement | null = null;

    public getDOMElement() {
        if (this._domElement) {
            return this._domElement;
        }
        const el = document.createElement('div');
        el.className = 'post-label';
        makeDraggable(el);
        this._domElement = el;
        return el;
    }

    public setPosition(x:number, y:number) {
        
    }
}
