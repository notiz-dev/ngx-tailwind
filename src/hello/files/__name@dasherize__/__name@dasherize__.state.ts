
import { State, Selector, StateContext, Action } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { <%= classify(name) %>StateModel } from './<%= dasherize(name) %>.types';
import { SetState, PatchState } from './<%= dasherize(name) %>.action';

@State<<%= classify(name) %>StateModel>({
    name: '<%= dasherize(name) %>',
  })
@Injectable()
export class <%= classify(name) %>State {

    @Selector()
    static state(state: <%= classify(name) %>StateModel) {
      return state;
    }

    @Action(SetState)
    set(ctx: StateContext<<%= classify(name) %>StateModel>, action: SetState) {
      ctx.setState(action.payload);
    }
    
    @Action(PatchState)
    patch(ctx: StateContext<<%= classify(name) %>StateModel>, action: PatchState) {
      ctx.patchState(action.payload);
    }
}
