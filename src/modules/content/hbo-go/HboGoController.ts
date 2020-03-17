import { ScrobbleController } from '../common/ScrobbleController';
import { HboGoParser } from './HboGoParser';

const HboGoController = new ScrobbleController(HboGoParser);

export { HboGoController };