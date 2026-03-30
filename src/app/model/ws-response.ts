import { WSAction } from './enums/ws-action';

export default class WSResponse<T> {
  constructor(public reason: string, public action: WSAction, public payload: T) {}
}
