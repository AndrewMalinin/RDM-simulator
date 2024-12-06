import React, { useContext, useEffect, useRef, useState } from 'react';
import IPlaygroundObject, { ICON_TYPE, ICoords, IPosition } from '../lib/Playground/IPlaygroundObject';
import { ReactComponent as rlsIcon } from '../../../shared/images/icons/rls.svg';
import { ReactComponent as sourceIcon } from '../../../shared/images/icons/source.svg';
import { SvgIcon } from '@mui/material';
import PlayGroundModelContext from './context/PlayGroundModelContext';

type PlaygroundObjectProps = { object: IPlaygroundObject };

const objectIconDict: { [key in ICON_TYPE]: React.FunctionComponent<React.SVGProps<SVGSVGElement>> } = {
    [ICON_TYPE.CIRCLE]: rlsIcon,
    [ICON_TYPE.RECEIVER]: rlsIcon,
    [ICON_TYPE.SOURCE]: sourceIcon
};

const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, onPositionChanged: (p: IPosition) => void) => {
    //@ts-ignore
    const elmnt: HTMLDivElement = e.target;
    let clickLeftOffset = 0;
    let clickTopOffset = 0;
    dragMouseDown(e.nativeEvent);
    function dragMouseDown(e: MouseEvent) {
        elmnt.classList.add('dragging');
        e = e || window.event;
        e.stopPropagation();
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
        onPositionChanged({ x: leftShift + elBounds.width / 2, y: topShift + elBounds.height / 2 });
    }

    function closeDragElement() {
        elmnt.classList.remove('dragging');
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
};

export default function PlaygroundObject({ object }: PlaygroundObjectProps) {
    //const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
    const plModel = useContext(PlayGroundModelContext);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (object && plModel) {
            object.subscribe(IPlaygroundObject.SIGNALS.COORDS_UPDATED, (c) => {
                recalculatePosition(c);
            });
            recalculatePosition(object.coords);
        }
    }, [object, plModel]);

    function recalculatePosition(coords: ICoords) {
        if (!ref || !ref.current || !plModel) return;
        const position = plModel.getPositionByCoords(coords);
        const elBounds = ref.current.getBoundingClientRect();
        ref.current.style.top = position.y - elBounds.height / 2 + 'px';
        ref.current.style.left = position.x - elBounds.width / 2 + 'px';
        //setPosition({ top: position.y - elBounds.height / 2, left: position.x - elBounds.width / 2 });
    }

    return (
        <div
            ref={ref}
            key={object.guid}
            className="label-object"
            onMouseDown={(e) => {
                handleMouseDown(e, object.setPosition.bind(object));
            }}
            style={{
                fontSize: object.style.size,
                color: object.style.color
            }}
        >
            <SvgIcon component={objectIconDict[object.icon]} />
        </div>
    );
}
