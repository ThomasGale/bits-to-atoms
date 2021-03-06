import { PayloadAction } from '@reduxjs/toolkit';
import { delay, put, select, take, takeEvery } from 'redux-saga/effects';
import { config } from '../../env/config';
import { BuildRequest } from '../buildrequest/types';
import { BasicShape } from '../common/topology/types';
import { LiquidAsset } from '../economic/types';
import { MaterialType } from '../material/types';
import {
  createTransmutationActivity,
  createTransportationActivity,
  createWorkflow,
} from '../workflow/factories';
import {
  Activity,
  TransmutationActivity,
  TransmutationStateType,
} from '../workflow/types';
import {
  currentServiceProviderCostPerTimeSelector,
  factoryLiquidAssetSelector,
} from './selectors';
import {
  createBasicShapeTransmutationState,
  createLiquidAssetTransmutationState,
} from './services/factories';
import { ServiceProvider } from './services/types';
import {
  addBuildRequest,
  offerFullfillmentOfActivity,
  requestFullfillmentOfActivity,
  setLiquidAssetDollars,
  updateBuildRequestWorkflow,
  acceptFullfillmentOfActivity,
  updateActivity,
} from './slice';

export function* factoryUpdateTickSaga() {
  const updateDelayMs = config.factory.updatePeriodMs;
  console.log(
    `Starting endless factory tick saga (with period length of ${updateDelayMs}ms)`
  );
  while (true) {
    yield delay(updateDelayMs);
    //console.log('Recompute economics of Factory');

    // Current State
    const currentLiquidAsset = (yield select(
      factoryLiquidAssetSelector
    )) as LiquidAsset;

    // Get income from the pending goods out buffer (Dispatch)

    // Get material investment from pending goods in buffer (Procurement)

    // Compute the cumulative current running cost of all service providers over the last updateDelay and update the current assets.
    const currentServiceProviderCostPerTime = (yield select(
      currentServiceProviderCostPerTimeSelector
    )) as LiquidAsset;
    const currentServiceProviderCostOverPeriod =
      currentServiceProviderCostPerTime.value.dollars * updateDelayMs;

    // Update the store with the current liquid assets.
    yield put(
      setLiquidAssetDollars(
        currentLiquidAsset.value.dollars - currentServiceProviderCostOverPeriod
      )
    );
  }
}

/**
 * Helper function to request and await fullfillment offers for an activity
 * @param activity Activity to be fullfilled
 * @returns ServiceProvider that has offered to fullfill the activity
 */
function* triggerRequestFullfillmentOfActivity(activity: Activity) {
  console.log(`Requesting fullfillment for activity ${activity.id}`);
  yield put(requestFullfillmentOfActivity(activity));

  // Wait for a fullfillment offer for this activity to come back from service providers.
  let fullfillmentOffer: PayloadAction<{
    serviceProvider: ServiceProvider;
    activity: Activity;
  }>;
  while (true) {
    fullfillmentOffer = (yield take(
      offerFullfillmentOfActivity.type
    )) as PayloadAction<{
      serviceProvider: ServiceProvider;
      activity: Activity;
    }>;
    if (fullfillmentOffer.payload.activity.id === activity.id) break;
  }
  return fullfillmentOffer;
}

/**
 * Primary workflow for handling the creation of the workflows which drive the factory.
 * @param addedActiveBuildRequest Build Request just added to the active list
 */
export function* buildRequestWorkflowSaga(
  addedActiveBuildRequest: PayloadAction<BuildRequest>
) {
  const { payload: buildRequest } = addedActiveBuildRequest;
  console.log(
    `Computing the required workflow for build request ${buildRequest.id} (given the current active transmutation service providers in the factory)`
  );

  // Examine the build request desired end shape and material.
  // Hack for now - to a known hardcoded flow for the basic polymer cube part (which is the only thing the simulated market is requesting for now.)
  if (
    !(
      buildRequest.material.type === MaterialType.SimplePolymer &&
      buildRequest.endShape === BasicShape.Cube
    )
  ) {
    console.error('Unable to compute workflow for this material type / shape.');
    return;
  }

  // New Proposed Steps.
  // Build a simple flat array of activities (inside the workflow) (they will hold internal references to each other)
  const computedWorkflow = createWorkflow();

  // WIP: The workflow below assumes that the workflow can be achieved with a simple, naive first branch picked search of the graph to build a part.

  // Current topological output shape in workflow generation
  let currentTopologyState = createBasicShapeTransmutationState({
    shape: buildRequest.endShape,
  });
  let previousTransmutationActivity: Activity;
  let currentTransmutationActivity: Activity;

  // 1. Request dispatch service provider and assign to final dispatch activity step.
  currentTransmutationActivity = createTransmutationActivity({
    displayName: 'Dispatch Part',
    startState: currentTopologyState,
    endState: createLiquidAssetTransmutationState({
      liquidAsset: buildRequest.fixedValue,
    }),
  });
  const dispatchOfferServiceProvider = (yield triggerRequestFullfillmentOfActivity(
    currentTransmutationActivity
  )) as PayloadAction<{
    serviceProvider: ServiceProvider;
    activity: Activity;
  }>;
  currentTransmutationActivity.serviceProvider =
    dispatchOfferServiceProvider.payload.serviceProvider;
  computedWorkflow.activities.push(currentTransmutationActivity);
  previousTransmutationActivity = currentTransmutationActivity;

  // 2. Perform the transmutation step search
  while (true) {
    currentTransmutationActivity = createTransmutationActivity({
      displayName: 'Transmute Part',
      endState: currentTopologyState,
    });
    const transmutationFullfillmentOffer = (yield triggerRequestFullfillmentOfActivity(
      currentTransmutationActivity
    )) as PayloadAction<{
      serviceProvider: ServiceProvider;
      activity: Activity;
    }>;
    const proposedServiceProvider =
      transmutationFullfillmentOffer.payload.serviceProvider;
    const proposedActivity = transmutationFullfillmentOffer.payload
      .activity as TransmutationActivity;
    if (!proposedActivity.startState) {
      console.error(
        'Transmutation fullfillment offer does not specify the start topology'
      );
      return;
    }

    currentTransmutationActivity.serviceProvider = proposedServiceProvider;
    currentTransmutationActivity.nextActivity = previousTransmutationActivity;
    previousTransmutationActivity.previousActivity = currentTransmutationActivity;
    computedWorkflow.activities.push(currentTransmutationActivity);

    if (
      proposedActivity.startState.type === TransmutationStateType.BasicShapeType
    ) {
      currentTopologyState = proposedActivity.startState;
      previousTransmutationActivity = currentTransmutationActivity;
    } else {
      console.log(
        'Transmutation list complete (current transmutation does not start with basic shape topology)'
      );
      currentTransmutationActivity.displayName = 'Procure Part';
      computedWorkflow.firstActivity = currentTransmutationActivity;
      break;
    }
  }

  // 3. Finally assemble the Transportation step search
  while (currentTransmutationActivity.nextActivity) {
    const startTransmutationServiceProvider =
      currentTransmutationActivity.serviceProvider;
    const endTransmutationServiceProvider =
      currentTransmutationActivity.nextActivity.serviceProvider;
    if (
      !startTransmutationServiceProvider ||
      !endTransmutationServiceProvider
    ) {
      console.error(
        'Start or end transmutation activity does not have an associated service provider...'
      );
      break;
    }

    const currentTransportActivity = createTransportationActivity({
      displayName: 'Transport Part',
      startLocation: startTransmutationServiceProvider.location,
      endLocation: endTransmutationServiceProvider.location,
    });
    const transportationFullfillmentOffer = (yield triggerRequestFullfillmentOfActivity(
      currentTransportActivity
    )) as PayloadAction<{
      serviceProvider: ServiceProvider;
      activity: Activity;
    }>;

    // Get the proposed transport service provider
    const proposedTransportServiceProvider =
      transportationFullfillmentOffer.payload.serviceProvider;

    // Update and insert the transport activity between the transmutation activities.
    // Update Current Transportation
    currentTransportActivity.serviceProvider = proposedTransportServiceProvider;
    currentTransportActivity.previousActivity = currentTransmutationActivity;
    currentTransportActivity.nextActivity =
      currentTransmutationActivity.nextActivity;
    computedWorkflow.activities.push(currentTransportActivity);

    // Transmutation Before
    currentTransmutationActivity.nextActivity = currentTransportActivity;

    // Transmutation After
    currentTransportActivity.nextActivity.previousActivity = currentTransportActivity;

    // Now consider the next transmutation activity
    currentTransmutationActivity = currentTransportActivity.nextActivity;
  }

  // Proposed workflow is now computed.
  console.log(
    `Proposed workflow computed! Id: ${computedWorkflow.id} with ${computedWorkflow.activities.length} steps`
  );

  // Send out the computed build request workflow
  yield put(
    updateBuildRequestWorkflow({
      buildRequestId: buildRequest.id,
      workflow: computedWorkflow,
    })
  );

  // Now the execution phase can begin
  // Simply loop through the activities in the workflow, triggering execution and waiting till completion.
  let currentExecutingActivity = computedWorkflow.firstActivity as Activity;
  while (true) {
    // Start the activity.
    if (!currentExecutingActivity.serviceProvider) {
      console.error(
        'Unabled to find current executing activities service provider'
      );
      break;
    }
    yield put(
      acceptFullfillmentOfActivity({
        serviceProvider: currentExecutingActivity.serviceProvider,
        activity: currentExecutingActivity,
      })
    );

    // Wait for the activity to complete.
    while (true) {
      const updateActivityAction = (yield take(
        updateActivity.type
      )) as PayloadAction<Activity>;
      if (
        updateActivityAction.payload.id === currentExecutingActivity.id &&
        updateActivityAction.payload.completed
      )
        break;
    }

    // Get next activity or break, if we have reached the end.
    if (!currentExecutingActivity.nextActivity) break;
    currentExecutingActivity = currentExecutingActivity.nextActivity;
  }

  // Onced completed remove the active build request (Or move to a completed state / section).
  console.log(`Completed workflow ${computedWorkflow.id}`);
}

export function* factoryWatchAddActiveBuildRequestSaga() {
  yield takeEvery(addBuildRequest.type, buildRequestWorkflowSaga);
}
