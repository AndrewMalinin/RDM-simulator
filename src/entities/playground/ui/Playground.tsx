import React, { useEffect, useRef, type FC } from 'react';

import './playground.css';
import PlaygroundModel from '../lib/Playground/PlaygroundModel';

type PlaygroundProps = {};

function makeDraggable(elmnt: HTMLDivElement) {
    var pos1 = 0,
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

export const Playground: FC<PlaygroundProps> = ({}) => {
    const model = useRef<PlaygroundModel | null>(null);

    useEffect(() => {
        const model = new PlaygroundModel(document.querySelector('.playground') as HTMLDivElement);
        model.init();
    }, []);

    return <div className="playground">{/* <div className="post-label" draggable></div> */}</div>;
};