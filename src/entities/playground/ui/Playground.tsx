import React, { useEffect, useRef, type FC } from 'react';

import './playground.css';
import PlaygroundModel from '../lib/Playground/PlaygroundModel';
import Label from '../lib/Playground/Label';
import IPlaygroundObject from '../lib/Playground/IPlaygroundObject';

type PlaygroundProps = {};

export const Playground: FC<PlaygroundProps> = ({}) => {
    const model = useRef<PlaygroundModel | null>(null);

    useEffect(() => {
        const _model = new PlaygroundModel(document.querySelector('.playground') as HTMLDivElement);
        _model.init();
        model.current = _model;
        addSource()
    }, []);

    function addSource() {
        const source = new Label();
        source.subscribe(IPlaygroundObject.SIGNALS.POSITION_UPDATED, (...props: any) => {
            console.log('playgroundObject position:', ...props);
        });
        model.current?.addObject(source);
    }

    return <div className="playground">{/* <div className="post-label" draggable></div> */}</div>;
};
