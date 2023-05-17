export const checkDependency = (resource: string, minimumVersion: string, printMessage?: boolean) =>
  exports.ps_lib.checkDependency(resource, minimumVersion, printMessage);
