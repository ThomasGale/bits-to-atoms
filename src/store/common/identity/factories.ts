import { v4 as uuidv4 } from 'uuid';
import { Identity } from './types';

export function createExistingIdentity({
  displayName = '',
  uuid = ''
} = {}): Identity {
  return {
    uuid,
    displayName
  };
}

export function createNewIdentity({ displayName = 'default' } = {}): Identity {
  return {
    uuid: uuidv4(),
    displayName: displayName
  };
}