import React from 'react';
import { Button } from '@material-ui/core';

import { BasicParameter } from './BasicParameter';
import { Selected } from '../../../store/selected/types';
import { Field, InjectedFormProps, reduxForm } from 'redux-form';
import { FloorSpace } from '../../../store/factory/types';

export interface SelectedParameters {
  selected: Selected;
}

class SelectedForm extends React.Component<
  SelectedParameters & InjectedFormProps<FloorSpace, SelectedParameters>
> {
  render() {
    const {
      /*form, initialValues, error,*/ selected,
      handleSubmit
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        {selected.parameters.map(parameter => {
          return (
            <Field
              key={parameter.identity.uuid}
              name={parameter.identity.uuid}
              component={BasicParameter}
              type="number"
              parse={(value: string) => Number(value)}
              parameter={parameter}
            />
          );
        })}
        <Button type="submit" color="primary" size="small">
          Update
        </Button>
      </form>
    );
  }
}

export default reduxForm<FloorSpace, SelectedParameters>({
  form: 'selectedForm'
})(SelectedForm);
