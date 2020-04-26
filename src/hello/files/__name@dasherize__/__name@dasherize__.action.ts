import { <%= classify(name) %>StateModel } from './<%= dasherize(name) %>.types';

export class SetState {
    static readonly type = '[<%= classify(name) %>] SetState]';
    constructor(public readonly payload: <%= classify(name) %>StateModel) {}
  }
  
export class PatchState {
    static readonly type = '[<%= classify(name) %>] PatchState]';
    constructor(public readonly payload: Partial<<%= classify(name) %>StateModel>) {}
  }