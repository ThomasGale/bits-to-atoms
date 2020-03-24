import React, { useMemo, useRef, useState } from 'react';
import { Euler, Mesh, Quaternion as ThreeQuaternion } from 'three';
import { FFFPrinter } from '../../../../store/factory/services/fffprinter/types';

type OwnProp = {
  fffPrinter: FFFPrinter;
};

type OwnDispatch = {
  onSelected: (id: string) => void;
};

type Props = OwnProp & OwnDispatch;

export function FFFPrinterElement(props: Props): JSX.Element {
  const mesh = useRef<Mesh>();

  const { id, location, orientation, bounds } = props.fffPrinter;

  // React hooks for converting the Quaterion into Euler angles.
  const [eulerRotation, setEulerRotation] = useState<Euler>(new Euler(0, 0, 0));
  useMemo(() => {
    const newEuler = new Euler(0, 0, 0);
    newEuler.setFromQuaternion(
      new ThreeQuaternion(
        orientation.x,
        orientation.y,
        orientation.z,
        orientation.w
      )
    );
    setEulerRotation(newEuler);
  }, [orientation]);

  return (
    <mesh
      castShadow
      receiveShadow
      position={[location.x, location.y, location.z]}
      rotation={eulerRotation}
      ref={mesh}
      onClick={(e) => {
        e.stopPropagation();
        props.onSelected(id);
      }}
    >
      <boxBufferGeometry
        attach="geometry"
        args={[
          bounds.max.x - bounds.min.x,
          bounds.max.y - bounds.min.y,
          bounds.max.z - bounds.min.z,
        ]}
      />
      <meshStandardMaterial attach="material" color={'lightgrey'} />
    </mesh>
  );
}
