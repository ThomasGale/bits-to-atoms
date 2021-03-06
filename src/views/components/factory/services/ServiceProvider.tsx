import React, { useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Mesh } from 'three';
import { RootState, RootDispatch } from '../../../../store';

import { FloorSpaceElement } from './FloorSpace';
import { HumanWorkerElement } from './HumanWorker';

import {
  ServiceProvider,
  ServiceType,
} from '../../../../store/factory/services/types';
import { FloorSpace } from '../../../../store/factory/services/floorspace/types';
import { HumanWorker } from '../../../../store/factory/services/humanworker/types';

import { setSelectedServiceProvider } from '../../../../store/selected/slice';
import { FFFPrinterElement } from './FFFPrinter';
import { FFFPrinter } from '../../../../store/factory/services/fffprinter/types';
import { ProcurementElement } from './Procurement';
import { ProcurementService } from '../../../../store/factory/services/procurementservice/types';
import { DispatchElement } from './Dispatch';
import { DispatchService } from '../../../../store/factory/services/dispatchservice/types';

function mapState(_: RootState) {
  return {};
}

function mapDispatch(dispatch: RootDispatch) {
  return {
    onSelected: (id: string) => {
      dispatch(setSelectedServiceProvider(id));
    },
  };
}
type OwnProps = {
  serviceProvider: ServiceProvider;
};

const connector = connect(mapState, mapDispatch);

type Props = ConnectedProps<typeof connector> & OwnProps;

function ServiceProviderElement(props: Props): JSX.Element {
  const mesh = useRef<Mesh>();

  // Pull out properties
  const { serviceProvider } = props;
  const { id, location } = serviceProvider;

  // Render generic things about service provider
  //  - Invisible bounding box at a location / Orientation
  //  - Proxy for the mesh?

  switch (serviceProvider.type) {
    case ServiceType.Floorspace:
      return (
        <FloorSpaceElement
          floorSpace={serviceProvider as FloorSpace}
          onSelected={props.onSelected}
        />
      );
    case ServiceType.Procurement:
      return (
        <ProcurementElement
          procurementService={serviceProvider as ProcurementService}
          onSelected={props.onSelected}
        />
      );
    case ServiceType.HumanWorker:
      return (
        <HumanWorkerElement
          humanWorker={serviceProvider as HumanWorker}
          onSelected={props.onSelected}
        />
      );
    case ServiceType.FFFPrinter:
      return (
        <FFFPrinterElement
          fffPrinter={serviceProvider as FFFPrinter}
          onSelected={props.onSelected}
        />
      );
    case ServiceType.Dispatch:
      return (
        <DispatchElement
          dispatchService={serviceProvider as DispatchService}
          onSelected={props.onSelected}
        />
      );
    default:
      return (
        <mesh
          position={[location.x, location.y, location.z]}
          ref={mesh}
          onClick={(e) => {
            e.stopPropagation();
            props.onSelected(id);
          }}
        >
          <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
          <meshStandardMaterial attach="material" color={'red'} />
        </mesh>
      );
  }
}

export default connector(ServiceProviderElement);
