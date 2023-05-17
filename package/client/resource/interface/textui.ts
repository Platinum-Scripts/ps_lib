import { IconLookup, IconName, IconPrefix } from '@fortawesome/fontawesome-common-types';
import { CSSProperties } from 'react';

interface OptionsProps {
  position?: 'right-center' | 'left-center' | 'top-center';
  icon?: IconName | [IconPrefix, IconName];
  iconColor?: string;
  style?: CSSProperties;
}
export const showTextUI = (text: string, options?: OptionsProps): void => exports.ps_lib.showTextUI(text, options);

export const hideTextUI = (): void => exports.ps_lib.hideTextUI();

export const isTextUIOpen = (): boolean => exports.ps_lib.isTextUIOpen();
