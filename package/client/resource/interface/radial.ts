import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types';

type RadialItem = {
  id: string;
  label: string;
  icon: IconName | [IconPrefix, IconName];
  onSelect?: (currentMenu: string | null, itemIndex: number) => void | string;
  menu?: string;
};

export const addRadialItem = (items: RadialItem | RadialItem[]) => exports.ps_lib.addRadialItem(items);

export const removeRadialItem = (item: string) => exports.ps_lib.removeRadialItem(item);

export const registerRadial = (radial: { id: string; items: Omit<RadialItem, 'id'>[] }) =>
  exports.ps_lib.registerRadial(radial);

export const hideRadial = () => exports.ps_lib.hideRadial();

export const disableRadial = (state: boolean) => exports.ps_lib.disableRadial(state);
