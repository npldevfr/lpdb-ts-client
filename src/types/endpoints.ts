import type { paths, components } from './openapi/generated'

export type EndpointPath = keyof paths
export type EndpointParams<T extends EndpointPath> = paths[T]['get']['parameters']['query']

export type SuccessfulResponse = components['schemas']['successfulResponse']
export type SuccessfulResponseWithWarning = components['schemas']['successfulResponseWithWarning']
export type ErrorResponse = components['schemas']['error']

export type ApiResponse = SuccessfulResponse | SuccessfulResponseWithWarning

export type StandardEndpoint =
  | '/broadcasters'
  | '/company'
  | '/datapoint'
  | '/externalmedialink'
  | '/placement'
  | '/player'
  | '/series'
  | '/squadplayer'
  | '/standingsentry'
  | '/standingstable'
  | '/team'
  | '/tournament'
  | '/transfer'
