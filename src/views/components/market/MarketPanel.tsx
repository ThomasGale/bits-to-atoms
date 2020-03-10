import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';

import { RootState } from '../../../store';
import { BuildRequestElement } from './BuildRequest';
import { buildRequestsSelector } from '../../../store/market/selectors';

function mapState(state: RootState) {
  return {
    buildRequests: buildRequestsSelector(state)
  };
}

const connector = connect(mapState);

type Props = ConnectedProps<typeof connector>;

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    flexGrow: 1,
    overflow: 'auto',
    maxHeight: '80vh' // Couldn't find a nicer way. Be cool if I could reference the max height of
  }
}));

function MarketPanel(props: Props): JSX.Element {
  const classes = useStyles();
  const { buildRequests } = props;
  return (
    <Box className={classes.container}>
      <Grid container spacing={3}>
        {buildRequests.map(request => {
          return (
            <Grid item xs={12} key={request.identity.uuid}>
              <BuildRequestElement buildRequest={request} />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default connector(MarketPanel);
