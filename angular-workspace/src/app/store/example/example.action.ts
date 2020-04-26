import { ExampleStateModel } from './example.types';

export class SetState {
    static readonly type = '[Example] SetState]';
    constructor(public readonly payload: ExampleStateModel) {}
  }
  
export class PatchState {
    static readonly type = '[Example] PatchState]';
    constructor(public readonly payload: Partial<ExampleStateModel>) {}
  }