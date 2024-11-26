import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IPlaygroundObject from '../lib/Playground/IPlaygroundObject';
import { ObjectGUID } from '../lib';

interface IPlayground {
    objects: { [key: ObjectGUID]: IPlaygroundObject };
}

const initialState = { objects: {} };

export const settingsSlice = createSlice({
    name: 'playground',
    initialState,
    reducers: {
        addObject: (_state, action: PayloadAction<IPlaygroundObject>) => {
            return action.payload;
        },
    }
});

export const { updateStep } = settingsSlice.actions;

export const getSettings = (state: RootState) => state.settings;

export default settingsSlice.reducer;
