import { ScrobbleController } from '../common/ScrobbleController';
import { NetflixParser } from './NetflixParser';

const NetflixController = new ScrobbleController(NetflixParser);

export { NetflixController };