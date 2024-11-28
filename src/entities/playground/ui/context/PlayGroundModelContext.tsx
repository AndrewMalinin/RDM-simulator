import { createContext } from 'react';
import PlaygroundModel from '../../lib/Playground/PlaygroundModel';

const PlayGroundModelContext = createContext<PlaygroundModel | null>(null);
export default PlayGroundModelContext;
