import { Identity } from '../../../common/identity/types';
import { Vector3, Quaternion, Cuboid } from '../../../common/primitive/types';
import { MaterialType } from '../../../material/types';
import { ServiceType } from '../types';
import { FFFPrinter } from './types';

import { createNewIdentity } from '../../../common/identity/factories';
import {
  createVector3,
  createQuaternion,
  createCuboid
} from '../../../common/primitive/factories';
import { createLiquidAsset } from '../../../economic/factories';

export function createFFFPrinter(
  id: Identity = createNewIdentity('default-fff-printer'),
  location: Vector3 = createVector3(),
  orientation: Quaternion = createQuaternion(),
  bounds: Cuboid = createCuboid(
    createVector3(-0.5, -0.5, 0),
    createVector3(0.5, 0.5, 1.0)
  ),
  currentCostPerTime = createLiquidAsset(1e-4),
  supportedMaterials: MaterialType[] = [MaterialType.SimplePolymer],
  outputVolume: Cuboid = createCuboid()
): FFFPrinter {
  return {
    type: ServiceType.FFFPrinter,
    id,
    location,
    orientation,
    bounds,
    currentCostPerTime,
    supportedMaterials,
    outputVolume
  };
}