import { Identity } from '../common/identity/types';
import { BuildRequest } from '../buildrequest/types';
import { OutputRegion, InputRegion } from './boundaries/types';
import { LiquidAsset, FixedAsset } from '../economic/types';
import { ServiceProvider } from './services/types';

export interface Factory {
  identity: Identity;
  activeBuildRequests: BuildRequest[];
  inputRegion: InputRegion;
  outputRegion: OutputRegion;
  liquidAsset: LiquidAsset;
  fixedAssets: FixedAsset[];
  serviceProviders: ServiceProvider[];
}
