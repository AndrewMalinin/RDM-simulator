import React, { MouseEventHandler, useEffect, useRef, useState, type FC } from 'react';

import './playground.css';
import PlaygroundModel from '../lib/Playground/PlaygroundModel';
import Label from '../lib/Playground/Label';
import IPlaygroundObject from '../lib/Playground/IPlaygroundObject';

import { ReactComponent as rlsIcon } from '../../../shared/images/icons/rls.svg';
import { SvgIcon } from '@mui/material';

type PlaygroundProps = {};

const handleMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    const elmnt: HTMLDivElement = e.target;
    let clickLeftOffset = 0;
    let clickTopOffset = 0;
    dragMouseDown(e.nativeEvent);
    function dragMouseDown(e: MouseEvent) {
        elmnt.classList.add('dragging');
        e = e || window.event;
        e.preventDefault();

        clickLeftOffset = e.clientX - elmnt.getBoundingClientRect().left;
        clickTopOffset = e.clientY - elmnt.getBoundingClientRect().top;

        // get the mouse cursor position at startup:
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e: MouseEvent) {
        e = e || window.event;
        e.preventDefault();

        const parentBounds = elmnt.parentElement?.getBoundingClientRect();
        if (!parentBounds) return;
        const elBounds = elmnt.getBoundingClientRect();

        const cursorX = e.clientX - parentBounds.left;
        const cursorY = e.clientY - parentBounds.top;

        const minLeft = 0;
        const maxLeft = parentBounds.width - elBounds.width;
        const minTop = 0;
        const maxTop = parentBounds.height - elBounds.height;

        let topShift = cursorY - clickTopOffset;
        let leftShift = cursorX - clickLeftOffset;

        if (topShift > maxTop) topShift = maxTop;
        else if (topShift < minTop) topShift = minTop;

        if (leftShift > maxLeft) leftShift = maxLeft;
        else if (leftShift < minLeft) leftShift = minLeft;

        elmnt.style.top = topShift + 'px';
        elmnt.style.left = leftShift + 'px';
    }

    function closeDragElement() {
        elmnt.classList.remove('dragging');
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
};

export const Playground: FC<PlaygroundProps> = ({}) => {
    const model = useRef<PlaygroundModel | null>(null);

    useEffect(() => {
        const _model = new PlaygroundModel(document.querySelector('.playground') as HTMLDivElement);
        _model.init();
        model.current = _model;
        addSource();
    }, []);

    function addSource() {
        const source = new Label();
        source.subscribe(IPlaygroundObject.SIGNALS.POSITION_UPDATED, (...props: any) => {
            console.log('playgroundObject position:', ...props);
        });
        source.addTo(model.current!);
    }

    return (
        <div className="playground">
            {model.current &&
                Object.values(model.current.objects).map((object) => {
                    return (
                        <div key={object.guid} className="post-label" onMouseDown={handleMouseDown}>
                            <SvgIcon component={rlsIcon} />
                        </div>
                    );
                })}
        </div>
    );
};
