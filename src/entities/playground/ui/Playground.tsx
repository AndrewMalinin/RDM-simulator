import React, { MouseEventHandler, useEffect, useRef, useState, type FC } from 'react';

import './playground.css';
import PlaygroundModel from '../lib/Playground/PlaygroundModel';
import Label from '../lib/Playground/Label';
import IPlaygroundObject, { ICON_TYPE, ICoords, IPosition } from '../lib/Playground/IPlaygroundObject';

import { useSelector } from 'react-redux';
import { objectsSelector } from '../model';
import SourceModel from '../lib/SourceModel';
import PlaygroundObject from './PlaygroundObject';

type PlaygroundProps = {};

export const Playground: FC<PlaygroundProps> = ({}) => {
    const model = useRef<PlaygroundModel | null>(null);
    const objects = useSelector(objectsSelector);
    const sourceModel = useRef<SourceModel | null>(null);

    useEffect(() => {
        const _model = new PlaygroundModel(document.querySelector('.playground') as HTMLDivElement);
        _model.init();
        model.current = _model;
        addSource();
    }, []);

    function addSource() {
        const sourceLabel = new Label();
        const receiverLabel = new Label();
        sourceLabel.icon = ICON_TYPE.SOURCE;
        receiverLabel.icon = ICON_TYPE.RECEIVER;
        receiverLabel.addTo(model.current)
        const sourceModel = new SourceModel();

        sourceLabel.subscribe(IPlaygroundObject.SIGNALS.COORDS_UPDATED, (props: any) => {
            sourceModel.updateCoords(props as ICoords);
        });

        sourceModel.subscribe(SourceModel.SIGNALS.COORDS_UPDATED, (props) => {
            console.log(`sourceModel coords updated: [${props?.x}, ${props?.y}]`);
        });
        sourceLabel.addTo(model.current!);
    }
    return (
        <div className="playground">
            {objects &&
                Object.values(objects).map((object) => {
                    return <PlaygroundObject object={object} key={object.guid} />;
                })}
        </div>
    );
};
