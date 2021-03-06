import React, { useMemo, useRef, useState } from 'react';
import { Euler, Mesh, Quaternion as ThreeQuaternion } from 'three';
import { FloorSpace } from '../../../../store/factory/services/floorspace/types';

type OwnProp = {
  floorSpace: FloorSpace;
};

type OwnDispatch = {
  onSelected: (id: string) => void;
};

type Props = OwnProp & OwnDispatch;

export function FloorSpaceElement(props: Props): JSX.Element {
  const mesh = useRef<Mesh>();

  const { id, location, orientation, bounds } = props.floorSpace;

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

  const thickness = 0.1;

  return (
    <mesh
      castShadow
      receiveShadow
      position={[location.x, location.y, location.z - thickness / 2]}
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
          thickness,
        ]}
      />
      <meshStandardMaterial attach="material" color={'grey'} />
    </mesh>
  );
}
