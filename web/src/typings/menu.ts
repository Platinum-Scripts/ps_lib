import { IconProp } from "@fortawesome/fontawesome-svg-core";

export type MenuPosition =
	| "top-left"
	| "top-right"
	| "bottom-left"
	| "bottom-right";

type Stat = {
	label: string;
	value: number;
};

export interface MenuItem {
	stats: Stat[];
	image?: string;
	label: string;
	progress?: number;
	colorScheme?: string;
	checked?: boolean;
	values?: Array<string | { label: string; description: string }>;
	description?: string;
	icon?: IconProp | string;
	iconColor?: string;
	rightIcon?: IconProp | string;
	rightIconColor?: string;
	defaultIndex?: number;
	close?: boolean;
	disabled?: boolean;
}

export interface MenuSettings {
	position?: MenuPosition;
	title: string;
	canClose?: boolean;
	items: Array<MenuItem>;
	startItemIndex?: number;
}

export type ListMenuContextType = {
	isListMenuOpen: boolean;
	setListMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
	listMenuPosition: string | null;
	setListMenuPosition: React.Dispatch<React.SetStateAction<string | null>>;
};
