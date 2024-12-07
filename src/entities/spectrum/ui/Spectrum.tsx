import React, { useEffect, useRef } from 'react';
import { GraphLib } from '../lib/GraphLib';

import './spectrum.css';
import GraphDataModel from '../lib/GraphDataModel';

type SpectrumProps = {};

export function Spectrum({}: SpectrumProps) {
    const containerRef = useRef(null);
    useEffect(() => {
        if (containerRef && containerRef.current) {
            const model = new GraphDataModel();
            const graph = new GraphLib({
                config: {},
                container: containerRef.current,
                model: model
            });
        }
    }, [containerRef]);

    return (
        <div
            className="spectrum-container"
            style={{
                height: '80vh',
                width: '90vw'
            }}
        >
            <div className="spectrum" ref={containerRef}>
                <canvas id="layer_graph" className="spectrum__layer" />
                <canvas id="layer_graph-max" className="spectrum__layer" />
                <canvas id="layer_axes" className="spectrum__layer" />
                <canvas id="layer_pointer" className="spectrum__layer" />
            </div>
        </div>
    );
}
