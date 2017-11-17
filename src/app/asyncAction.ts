import {action, runInAction} from 'mobx';

declare const Zone;

const asyncAction = function(target, prop: string, descriptor) {
  //Create a zone that will wrap all async tasks in an action
  let actionZone = Zone.current.fork({
    onInvoke: (parentZoneDelegate, currentZone, targetZone, delegate: Function,
               applyThis: any, applyArgs: any[], source: string) => {

      let actionName = `${prop}:${delegate.name || 'async'}`;
      let actionDelegate = (...args) => runInAction(actionName, () => delegate(...args));

      return parentZoneDelegate.invoke(targetZone, actionDelegate, applyThis, applyArgs, source);
    }
  });

  //Modify the annotated function so that it runs in the actionZone
  let origFunc = descriptor.value;
  descriptor.value = function(...args) {
    return actionZone.run(() => origFunc.call(this, ...args));
  };

  return action(target, prop, descriptor);
};

export default asyncAction;
