import React, { MouseEventHandler, useEffect, useRef, useState, type FC } from 'react';

import './playground.css';
import PlaygroundModel from '../lib/Playground/PlaygroundModel';
import Label from '../lib/Playground/Label';
import IPlaygroundObject, { ICON_TYPE, ICoords, IPosition } from '../lib/Playground/IPlaygroundObject';

import { useSelector } from 'react-redux';
import { objectsSelector } from '../model';
import SourceModel from '../lib/SourceModel';
import PlaygroundObject from './PlaygroundObject';
import PlayGroundModelContext from './context/PlayGroundModelContext';
import GraphCanvasModel from '../lib/Playground/GraphCanvasModel';

type PlaygroundProps = {};

export const Playground: FC<PlaygroundProps> = ({}) => {
    const model = useRef<PlaygroundModel | null>(null);
    const objects = useSelector(objectsSelector);
    const sourceModel = useRef<SourceModel | null>(null);

    useEffect(() => {
        const _model = new PlaygroundModel(document.querySelector('.playground') as HTMLDivElement);
        model.current = _model;
        addSource();
    }, []);

    function addSource() {
        const sourceLabel = new Label({ x: 10, y: 10 });
        const receiverLabel = new Label({ x: -10, y: -10 });
        sourceLabel.icon = ICON_TYPE.SOURCE;
        receiverLabel.icon = ICON_TYPE.RECEIVER;
        receiverLabel.style.size = 32;
        receiverLabel.addTo(model.current);
        const sourceModel = new SourceModel();

        sourceLabel.subscribe(IPlaygroundObject.SIGNALS.COORDS_UPDATED, (props: any) => {
            sourceModel.updateCoords(props as ICoords);
        });

        function redraw() {
            model.current?.graphModel.clear();
            model.current?.graphModel.addGraphic([
                [receiverLabel.coords.x, receiverLabel.coords.y],
                [sourceLabel.coords.x, sourceLabel.coords.y]
            ]);
        }

        sourceLabel.subscribe(IPlaygroundObject.SIGNALS.COORDS_UPDATED, redraw);
        receiverLabel.subscribe(IPlaygroundObject.SIGNALS.COORDS_UPDATED, redraw);
        sourceLabel.addTo(model.current!);
    }
    return (
        <PlayGroundModelContext.Provider value={model.current}>
            <div className="playground">
                {objects &&
                    Object.values(objects).map((object) => {
                        return <PlaygroundObject object={object} key={object.guid} />;
                    })}
            </div>
        </PlayGroundModelContext.Provider>
    );
};
