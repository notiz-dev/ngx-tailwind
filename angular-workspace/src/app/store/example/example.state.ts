
import { State, Selector, StateContext, Action } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ExampleStateModel } from './example.types';
import { SetState, PatchState } from './example.action';

@State<ExampleStateModel>({
    name: 'example',
  })
@Injectable()
export class ExampleState {

    @Selector()
    static state(state: ExampleStateModel) {
      return state;
    }

    @Action(SetState)
    set(ctx: StateContext<ExampleStateModel>, action: SetState) {
      ctx.setState(action.payload);
    }
    
    @Action(PatchState)
    patch(ctx: StateContext<ExampleStateModel>, action: PatchState) {
      ctx.patchState(action.payload);
    }
}
