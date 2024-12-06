import React, { useEffect } from 'react';
import { Graph } from '../lib/graph';

import './spectrum.css';

type SpectrumProps = {};

export function Spectrum({}: SpectrumProps) {
    useEffect(() => {
        const graph = new Graph();
    }, []);
    return (
        <div
            className="spectrum-container"
            style={{
                height: '80vh',
                width: '90vw'
            }}
        >
            <div className="spectrum">
                <canvas id="layer_graph" className="spectrum__layer" />
                <canvas id="layer_graph-max" className="spectrum__layer" />
                <canvas id="layer_axes" className="spectrum__layer" />
                <canvas id="layer_pointer" className="spectrum__layer" />
            </div>
        </div>
    );
}
