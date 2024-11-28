import Observable from '../../../shared/lib/Observable';
import ReceiverModel, { ReceiverID } from './ReceiverModel';

export default class ReceiverModelCollection extends Observable {
    private _receivers: { [key: ReceiverID]: ReceiverModel } = {};
    public addReceiver() {
        const receiver = new ReceiverModel(Object.keys(this._receivers).length);
        this._receivers[receiver.id] = receiver;
        return receiver;
    }
}

export const receiverModelCollection = new ReceiverModelCollection();
