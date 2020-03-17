import { ScrobbleController } from '../common/ScrobbleController';
import { AmazonPrimeParser } from './AmazonPrimeParser';

const AmazonPrimeController = new ScrobbleController(AmazonPrimeParser);

export { AmazonPrimeController };