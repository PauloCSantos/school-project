import { StatesEnum } from '../../enums/enums';
import { States } from '../../type/sharedTypes';

export default class Lifecycle {
  private constructor(private readonly current: States) {}

  static from(state: States) {
    return new Lifecycle(state);
  }
  static active() {
    return new Lifecycle(StatesEnum.ACTIVE);
  }
  static inactive() {
    return new Lifecycle(StatesEnum.INACTIVE);
  }
  static pending() {
    return new Lifecycle(StatesEnum.PENDING);
  }

  get value(): States {
    return this.current;
  }

  deactivate(): Lifecycle {
    return this.current === StatesEnum.INACTIVE ? this : Lifecycle.inactive();
  }

  activate(requireVerification = false): Lifecycle {
    if (requireVerification && this.current === StatesEnum.PENDING) return this;
    if (!requireVerification && this.current === StatesEnum.ACTIVE) return this;
    return requireVerification ? Lifecycle.pending() : Lifecycle.active();
  }

  markVerified(): Lifecycle {
    return this.current === StatesEnum.PENDING ? Lifecycle.active() : this;
  }

  equals(state: States): boolean {
    return this.current === state;
  }
}
