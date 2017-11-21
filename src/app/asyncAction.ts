import {action, endAction, runInAction, startAction} from 'mobx';

declare const Zone;

const ENABLE_LOGGING = false;

const asyncAction = function (target, prop: string, descriptor) {
  let pendingAction;
  let finishedInitialSyncAction = false;

  //Create a zone that will wrap all async tasks in an action
  let actionZone = Zone.current.fork({
    name: `mobxActionZone:${prop}`,
    // onInvoke: (parentZoneDelegate, currentZone, targetZone, delegate: Function,
    //            applyThis: any, applyArgs: any[], source: string) => {
    //
    //   let actionName = `${prop}:${delegate.name || 'async'}`;
    //   let actionDelegate = (...args) => runInAction(actionName, () => delegate(...args));
    //
    //   return parentZoneDelegate.invoke(targetZone, actionDelegate, applyThis, applyArgs, source);
    // }

    // onInvoke(delegate, current, targetZone, callback, ...args) {
    //   let actionName = `${prop}:${callback.name || 'async'}`;
    //   return runInAction(actionName, () => delegate.invoke(targetZone, callback, ...args));
    // }

    onScheduleTask(delegate, currentZone, targetZone, task) {
      ENABLE_LOGGING && console.log('SCHEDULING TASK', task.type);
      return delegate.scheduleTask(targetZone, task);
    },

    onInvokeTask(delegate, currentZone, targetZone, task, ...args) {
      let actionName = `${prop}:${task.callback.name || 'async'}`;
      ENABLE_LOGGING && console.log('INVOKE TASK', task.type, task.callback);
      if (task.type === 'macroTask') {
        return runInAction(actionName, () => delegate.invokeTask(targetZone, task, ...args));
      } else {
        return delegate.invokeTask(targetZone, task, ...args);
      }
    },

    // onIntercept(parentZoneDelegate, currentZone, targetZone, delegate: Function, source: string) {
    //   console.log('what the fork?');
    // },
    onHasTask(parentZoneDelegate, currentZone, targetZone, hasTaskState) {
      ENABLE_LOGGING && console.log('HAS TASK', hasTaskState);

      if (hasTaskState.change === 'microTask' && finishedInitialSyncAction) {
        if (hasTaskState.microTask) {
          pendingAction = startAction(`${prop}:async`, () => {}, null);
        } else if (pendingAction) {
          endAction(pendingAction);
          pendingAction = undefined;
        }
      }

    }
  });


  //Modify the annotated function so that it runs in the actionZone
  let origFunc = descriptor.value;
  descriptor.value = function (...args) {
    return actionZone.run(() => {
      finishedInitialSyncAction = false;
      let result = origFunc.call(this, ...args);
      finishedInitialSyncAction = true;
      return result;
    });
  };

  return action(target, prop, descriptor);
};

export default asyncAction;
