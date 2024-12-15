import React, { useEffect, useRef } from 'react';

import { GraphLib } from '../lib/GraphLib';

import './spectrum.css';
import GraphDataModel, { GRAPH_VIEW_TYPE, IMinMax, VALUES_TYPE } from '../lib/GraphDataModel';
import webfft from 'webfft';
import { Box } from '@mui/material';

type SpectrumProps = {};

function getSin(A: number, f: number, t: number, A_0: number, fi_0: number) {
    return A * Math.sin(2 * Math.PI * f * t + fi_0) + A_0;
}

function awgn(A: number) {
    return 2 * A * Math.random() - A;
}

function square(A: number, f: number, t: number) {
    const temp = t % (1 / f) > 0.5 / f ? 0 : 1;
    return A * temp ;
}

function getFFT(data: Array<number>): Array<number> {
    const _webfft = new webfft(2048);
    const input = new Float32Array(4096);
    input.fill(0);
    let j = 0;
    for (let i = 0; i < input.length - 1; i += 2) {
        input[i] = data[j];
        j++;
    }

    _webfft.fft(input);
    const out = _webfft.fft(input);
    _webfft.dispose();
    const resultIQ = [];
    for (let num of out) {
        resultIQ.push(num);
    }
    const result = [];
    for (let i = 0; i < resultIQ.length / 2; i += 2) {
        const sum = Math.sqrt(Math.pow(resultIQ[i], 2) + Math.pow(resultIQ[i + 1], 2));
        result.push(sum / 1024);
    }
    return result;
}

function adaptiveMinMax(model: GraphDataModel) {
    const adaptiveMin = Math.min(model.minMax.y[0], Math.floor(Math.min(...model.data!.data.y) / 10) * 10);
    const adaptiveMax = Math.max(model.minMax.y[1], Math.ceil(Math.max(...model.data!.data.y) / 10) * 10);

    model.minMax = {
        ...model.minMax,
        y: [adaptiveMin, adaptiveMax === Infinity ? 100 : adaptiveMax]
    };
}

export function Spectrum({}: SpectrumProps) {
    const signalContainerRef = useRef(null);
    const spectrumContainerRef = useRef(null);
    useEffect(() => {
        if (
            !spectrumContainerRef ||
            !spectrumContainerRef.current ||
            !signalContainerRef ||
            !signalContainerRef.current
        )
            return;
        const spectrumModel = new GraphDataModel(GRAPH_VIEW_TYPE.LINES);
        const spectrumGraph = new GraphLib({
            config: {},
            container: spectrumContainerRef.current,
            model: spectrumModel
        });
        spectrumModel.minMax = {
            x: [0, 1024],
            y: [0, 10]
        };

        const signalModel = new GraphDataModel(GRAPH_VIEW_TYPE.LINES);
        const signalGraph = new GraphLib({
            config: {},
            container: signalContainerRef.current,
            model: signalModel
        });
        signalModel.minMax = {
            x: [0, 1],
            y: [-10, 10]
        };

        function draw() {
            let i = 0;
            const data = [...Array(2048)].map((v) => {
                i += 1 / 2048;
                return square(100, 322, i) //* getSin(20, 512, i, 0, 0)+ awgn(0)// + getSin(2, 32, i, 0, 0)  + awgn(50)*/;
            });

            signalModel.setData({
                data: {
                    type: VALUES_TYPE.XRANGE_Y,
                    y: data,
                    x: signalModel.minMax!.x
                },
                color: '#23ee85'
            });
            const fft = getFFT(data);
            spectrumModel.setData({
                data: {
                    type: VALUES_TYPE.XRANGE_Y,
                    y: fft,
                    x: spectrumModel.minMax!.x
                },
                color: '#84bff9'
            });

            adaptiveMinMax(spectrumModel);
            adaptiveMinMax(signalModel);
        }
        setInterval(draw, 10);
    }, [spectrumContainerRef, signalContainerRef]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                flexGrow: 1,
                height: '90vh'
            }}
        >
            <div
                className="signal-container container"
                style={{
                    height: '100%',
                    width: '90vw'
                }}
            >
                <div className="signal" ref={signalContainerRef}></div>
            </div>
            <div
                className="spectrum-container container"
                style={{
                    height: '100%',
                    width: '90vw'
                }}
            >
                <div className="spectrum" ref={spectrumContainerRef}></div>
            </div>
        </Box>
    );
}
