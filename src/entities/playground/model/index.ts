import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import IPlaygroundObject from '../lib/Playground/IPlaygroundObject';
import { ObjectGUID } from '../lib';

interface IPlaygroundState {
    objects: { [key: ObjectGUID]: IPlaygroundObject };
}

const initialState: IPlaygroundState = {
    objects: {}
};

export const settingsSlice = createSlice({
    name: 'playground',
    initialState,
    reducers: {
        addObject: (_state, action: PayloadAction<IPlaygroundObject>) => {
            console.log(action.payload);
            console.log(_state);
            _state.objects = { ..._state.objects, [action.payload.guid]: action.payload };
        }
    },
    selectors: {
        objectsSelector: (state) => state.objects
    }
});

export const { addObject } = settingsSlice.actions;
export const { objectsSelector } = settingsSlice.selectors;

export default settingsSlice.reducer;
