export const config = {
  topNav: {
    gitHubURL: 'https://github.com/ThomasGale/bits-to-atoms'
  },
  market: {
    simpleMarketSaga: {
      partNames: [
        'widget',
        'thingy',
        'whatchamacallit',
        'thingamajig',
        'doohickey',
        'doofery'
      ],
      partValueRange: {
        min: 5,
        max: 10
      },
      maxNumberOpenRequests: 3,
      processingDelayRange: {
        min: 1000,
        max: 2000
      }
    }
  },
  factory: {
    updatePeriodMs: 1000,
    maxNumberActiveBuilds: 2
  }
};
