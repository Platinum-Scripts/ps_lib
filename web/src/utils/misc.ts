import React from "react";
import { Text, TextProps } from "@mantine/core";
import Textfit from '@namhong2001/react-textfit';

// Will return whether the current environment is in a regular browser
// and not CEF
export const isEnvBrowser = (): boolean => !(window as any).invokeNative;

// Basic no operation function
export const noop = () => {};