import React, { useEffect, useRef } from 'react';
import { GraphLib } from '../lib/GraphLib';

import './spectrum.css';
import GraphDataModel, { GRAPH_VIEW_TYPE, IMinMax, VALUES_TYPE } from '../lib/GraphDataModel';

type SpectrumProps = {};

export function Spectrum({}: SpectrumProps) {
    const containerRef = useRef(null);
    useEffect(() => {
        if (containerRef && containerRef.current) {
            const model = new GraphDataModel(GRAPH_VIEW_TYPE.LINES);
            const graph = new GraphLib({
                config: {},
                container: containerRef.current,
                model: model
            });
            model.minMax = {
                x: [0, 2000],
                y: [2000, 4000]
            };
            let f = 0;
            setInterval(() => {
                f = f + ((Math.PI / 200) % 2) * Math.PI;
                const {
                    x: [xMin, xMax],
                    y: [yMin, yMax]
                } = model.minMax as IMinMax;
                model.setData({
                    data: {
                        type: VALUES_TYPE.XRANGE_Y,
                        y: [...Array(2000)].map(
                            (v, i) =>  500*Math.sin((i * Math.PI) / 50 - f) + 3000
                        ),
                        x: [xMin, xMax]
                    },
                    color: '#84bff9'
                });
            }, 20);
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
            </div>
        </div>
    );
}
