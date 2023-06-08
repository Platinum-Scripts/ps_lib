import { Box, createStyles, Stack, Tooltip, Text } from '@mantine/core';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNuiEvent } from '../../../hooks/useNuiEvent';
import ListItem from './ListItem';
import Header from './Header';
import FocusTrap from 'focus-trap-react';
import { fetchNui } from '../../../utils/fetchNui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import type { MenuPosition, MenuSettings } from '../../../typings';
import { ListMenuContext } from '../../../App';
import { FloatingPosition } from '@mantine/core/lib/Floating';
import { theme } from '../../../theme';
import {autoCrop} from "../../notifications/NotificationWrapper";

let white: string;

const useStyles = createStyles(
	(
		theme, params: { position?: MenuPosition; itemCount: number; selected: number }
	) => (
		{
			tooltip: {
				backgroundColor: theme.colors.lighter[1],
				color: theme.colors.lighter[0],
				borderRadius: theme.radius.sm,
				maxWidth: 350,
				whiteSpace: 'normal',
			},
			container: {
				position: 'absolute',
				pointerEvents: 'none',
				marginTop: params.position === 'top-left' || params.position === 'top-right' ? 8 : 2,
				marginLeft: params.position === 'top-left' || params.position === 'bottom-left' ? 8 : 2,
				marginRight: params.position === 'top-right' || params.position === 'bottom-right' ? 8 : 2,
				marginBottom: params.position === 'bottom-left' || params.position === 'bottom-right' ? 8 : 2,
				right: params.position === 'top-right' || params.position === 'bottom-right' ? 1 : undefined,
				left: params.position === 'bottom-left' ? 1 : undefined,
				bottom: params.position === 'bottom-left' || params.position === 'bottom-right' ? 1 : undefined,
				fontFamily: 'Roboto',
			},
			wrapTheWrap: {
				borderRadius: theme.radius.md,
				backgroundColor: theme.colors.lighter[2],
				borderTopLeftRadius: theme.radius.md,
				borderTopRightRadius: theme.radius.md,
				borderBottomLeftRadius: theme.radius.md,
				borderBottomRightRadius: theme.radius.md,
			},
			buttonsWrapper: {
				height: 'fit-content',
				maxHeight: 415,
				overflow: 'hidden',
			},
			scrollArrow: {
				backgroundColor: theme.colors.lighter[2],
				textAlign: 'center',
				height: 25,
				borderBottomLeftRadius: theme.radius.md,
				borderBottomRightRadius: theme.radius.md,
				paddingTop: "0.475em",
				paddingBottom: "0.75em",
			},
			scrollArrowIcon: {
				color: theme.colors.lighter[0],
				fontSize: 20,
			},
			bottomBoxes: {
				width: "auto",
				backgroundColor: theme.colors.lighter[1],
				color: theme.colors.lighter[0],
				borderRadius: theme.radius.sm,
				fontWeight: 900
			},
			"50": {
				opacity: 0.5,
			}
		}
	)
);

function ColorText(text: string) {
	if (theme && theme.colors && theme.colors.lighter && theme.colors.lighter[0]) {
		white = theme.colors.lighter[0];
	}

	const colorMap: { [key: string]: string } = {
		'r': 'rgba(224, 50, 50, 1)',
		'g': 'rgba(114, 204, 114, 1)',
		'b': 'rgba(93, 182, 229, 1)',
		'f': 'rgba(93, 182, 229, 1)',
		'y': 'rgba(240, 200, 80, 1)',
		'c': 'rgba(140, 140, 140, 1)',
		't': 'rgba(140, 140, 140, 1)',
		'o': 'rgba(255, 133, 85, 1)',
		'p': 'rgba(132, 102, 226, 1)',
		'q': 'rgba(203, 54, 148, 1)',
		'm': 'rgba(100, 100, 100, 1)',
		'l': 'rgba(0, 0, 0, 1)',
		'd': 'rgba(47, 92, 115, 1)',
		's': white || '#ffffff',
		'w': white || '#ffffff',
	};
	
	const regex = /~(\w)~([^~]*)/gs;
	let match;
	let parts = [];
	let lastIndex = 0;

	// replace ~bold~ to ~h~ for simplicity
	text = text.replace("~bold~", "~h~");

	while ((match = regex.exec(text)) !== null) {
		// Add the text before the match
		if (match.index > lastIndex) {
			parts.push(text.substring(lastIndex, match.index));
		}

		// other formatting than color
		let tag = match[1];
		if (tag == "n") {
			// </br>
			parts.push(<br />);
		} else if (tag == "h") {
			// we must look for the next ~h~ to know where to stop
			let nextH = text.indexOf("~h~", regex.lastIndex);
			if (nextH == -1) {
				// no closing tag, we'll just add the rest of the text
				parts.push(text.substring(regex.lastIndex));
				break;
			} else {
				// add text between ~h~ as bold
				let boldText = text.substring(regex.lastIndex, nextH);
				parts.push(<b>{boldText}</b>);
				// update the last index to be after the closing ~h~
				lastIndex = nextH + 3; // 3 is the length of "~h~"
			}
		} else {
			// Add the colored text (from the first ~ to the next ~ or the end of the string)
			parts.push(<span style={{ color: colorMap[match[1]] || '#000' }}>{match[2]}</span>);
		}

		// Update the last index to the end of the current match
		lastIndex = regex.lastIndex;
	}

	// Add the rest of the string after the last match, if there is any
	if (lastIndex < text.length) {
		parts.push(text.substring(lastIndex));
	}

	return parts;
}

function halfOpacity(text: string) {
	const regex = /<50>(.*?)<\/50>/g;
	let match;
	let parts = [];
	let lastIndex = 0;

	while ((match = regex.exec(text)) !== null) {
		if (match.index > lastIndex) {
			parts.push(
				ColorText(text.substring(lastIndex, match.index))
			);
			// parts.push(text.substring(lastIndex, match.index));
		}

		// Here we add match[1] (the content inside the tags), not match[0] (the whole match)
		parts.push(<span style={{ opacity: 0.5 }}>{ColorText(match[1])}</span>);
		// parts.push(<span style={{opacity: 0.5}}>{match[1]}</span>);
		lastIndex = regex.lastIndex;
	}

	// Add the rest of the string after the last match, if there is any
	if (lastIndex < text.length) {
		parts.push(
			ColorText(text.substring(lastIndex))
		);
		// parts.push(text.substring(lastIndex));
	}

	return parts;
}

const ListMenu: React.FC = () => {
	const [menu, setMenu] = useState<MenuSettings>({
		position: 'top-left',
		title: '',
		items: [],
	});

	const [selected, setSelected] = useState(0);
	const [visible, setVisible] = useState(false);
	const [indexStates, setIndexStates] = useState<Record<number, number>>({});
	const [checkedStates, setCheckedStates] = useState<Record<number, boolean>>({});
	const listRefs = useRef<Array<HTMLDivElement | null>>([]);
	const firstRenderRef = useRef(false);
	// A reference to keep track of which keys are being held down
	const keysDownRef = useRef<Record<string, number>>({}); // {key: timeKeyPressed}

	const { classes } = useStyles({ position: menu.position, itemCount: menu.items.length, selected });

	const listMenuContext = useContext(ListMenuContext);

	const isListMenuOpen = listMenuContext?.isListMenuOpen || false;
	const setListMenuOpen = listMenuContext?.setListMenuOpen;
	const listMenuPosition = listMenuContext?.listMenuPosition || 'top-left';
	const setListMenuPosition = listMenuContext?.setListMenuPosition;

	const closeMenu = (ignoreFetch?: boolean, keyPressed?: string, forceClose?: boolean) => {
		if (menu.canClose === false && !forceClose) return;
		setVisible(false);
		if (!ignoreFetch) fetchNui('closeMenu', keyPressed);
	};

	const moveMenu = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (firstRenderRef.current) firstRenderRef.current = false;
		switch (e.code) {
			case 'ArrowDown':
				fetchNui("PLAY_SOUND_FRONTEND", { audioName: "NAV_UP_DOWN", audioRef: "HUD_FRONTEND_DEFAULT_SOUNDSET" }).catch();
				setSelected((selected) => {
					if (selected >= menu.items.length - 1) return (selected = 0);
					console.log(`Selected: ${selected + 1}`)
					return selected + 1;
				});
				setTimeout(() => {
					return;
				}, 50);
				break;
			case 'ArrowUp':
				fetchNui("PLAY_SOUND_FRONTEND", { audioName: "NAV_UP_DOWN", audioRef: "HUD_FRONTEND_DEFAULT_SOUNDSET" }).catch();
				setSelected((selected) => {
					if (selected <= 0) return (selected = menu.items.length - 1);
					return selected - 1;
				});
				setTimeout(() => {
					return;
				}, 50);
				break;
			case 'ArrowRight':
				if (Array.isArray(menu.items[selected].values)) {
					// Start tracking when a key is pressed
					if (!keysDownRef.current[e.code]) keysDownRef.current[e.code] = Date.now();

					fetchNui("PLAY_SOUND_FRONTEND", { audioName: "NAV_LEFT_RIGHT", audioRef: "HUD_FRONTEND_DEFAULT_SOUNDSET" }).catch();
					setIndexStates({
						...indexStates,
						[selected]:
							indexStates[selected] + 1 <= menu.items[selected].values?.length! - 1 ? indexStates[selected] + 1 : 0,
					});
				}
				break;
			case 'ArrowLeft':
				if (Array.isArray(menu.items[selected].values)) {
					// Start tracking when a key is pressed
					if (!keysDownRef.current[e.code]) keysDownRef.current[e.code] = Date.now();

					fetchNui("PLAY_SOUND_FRONTEND", { audioName: "NAV_LEFT_RIGHT", audioRef: "HUD_FRONTEND_DEFAULT_SOUNDSET" }).catch();
					setIndexStates({
						...indexStates,
						[selected]:
							indexStates[selected] - 1 >= 0 ? indexStates[selected] - 1 : menu.items[selected].values?.length! - 1,
					});
				}

				break;
			case 'Enter':
				if (!menu.items[selected]) return;

				if (menu.items[selected]?.disabled) {
					fetchNui("PLAY_SOUND_FRONTEND", { audioName: "ERROR", audioRef: "HUD_FRONTEND_DEFAULT_SOUNDSET" }).catch();
					return;
				}

				if (menu.items[selected].checked !== undefined && !menu.items[selected].values) {
					fetchNui("PLAY_SOUND_FRONTEND", { audioName: "TOGGLE_ON", audioRef: "HUD_FRONTEND_DEFAULT_SOUNDSET" }).catch();
					return setCheckedStates({
						...checkedStates,
						[selected]: !checkedStates[selected],
					});
				}

				fetchNui("PLAY_SOUND_FRONTEND", { audioName: "SELECT", audioRef: "HUD_FRONTEND_DEFAULT_SOUNDSET" }).catch();
				fetchNui('confirmSelected', [selected, indexStates[selected]]).catch();
				if (menu.items[selected].close === undefined || menu.items[selected].close) setVisible(false);

				// 50ms delay to prevent double clicks
				setTimeout(() => {
					return;
				}, 50);

				break;
		}
	};

	// Add a function to stop tracking when a key is released
	const stopMoveMenu = (e: React.KeyboardEvent<HTMLDivElement>) => {
		delete keysDownRef.current[e.code];
	};

	useEffect(() => {
		if (menu.items[selected]?.checked === undefined || firstRenderRef.current) return;
		const timer = setTimeout(() => {
			fetchNui('changeChecked', [selected, checkedStates[selected]]).catch();
		}, 100);
		return () => clearTimeout(timer);
	}, [checkedStates]);

	useEffect(() => {
		if (!menu.items[selected]?.values || firstRenderRef.current) return;
		// The base delay
		let delay = 33;

		// If a key is being pressed, adjust the delay based on how long it's been pressed
		if (keysDownRef.current["ArrowRight"]) {
			// Get the number of seconds the key has been pressed
			let secondsKeyPressed = (Date.now() - keysDownRef.current["ArrowRight"]) / 1000;
			// Reduce the delay exponentially based on how long the key has been pressed
			delay /= Math.pow(3, secondsKeyPressed);
		} else if (keysDownRef.current["ArrowLeft"]) {
			// Get the number of seconds the key has been pressed
			let secondsKeyPressed = (Date.now() - keysDownRef.current["ArrowLeft"]) / 1000;
			// Reduce the delay exponentially based on how long the key has been pressed
			delay /= Math.pow(3, secondsKeyPressed);
		}

		const timer = setTimeout(() => {
			fetchNui('changeIndex', [selected, indexStates[selected]]).catch();
		}, delay);
		return () => clearTimeout(timer);
	}, [indexStates]);


	useEffect(() => {
		if (!menu.items[selected]) return;
		if (listRefs && listRefs.current && listRefs.current[selected]) {
			listRefs.current[selected]?.scrollIntoView({
				block: 'nearest',
				inline: 'start',
			});
			listRefs.current[selected]?.focus({ preventScroll: true });
		}
		// debounces the callback to avoid spam
		const timer = setTimeout(() => {
			fetchNui('changeSelected', [
				selected,
				menu.items[selected].values
					? indexStates[selected]
					: menu.items[selected].checked
						? checkedStates[selected]
						: null,
				menu.items[selected].values ? 'isScroll' : menu.items[selected].checked ? 'isCheck' : null,
			]).catch();
		}, 100);
		return () => clearTimeout(timer);
	}, [selected, menu]);

	useEffect(() => {
		if (!visible) return;

		const keyHandler = (e: KeyboardEvent) => {
			if (['Escape', 'Backspace'].includes(e.code)) closeMenu(false, e.code);
		};

		window.addEventListener('keydown', keyHandler);

		return () => window.removeEventListener('keydown', keyHandler);
	}, [visible]);

	const isValuesObject = useCallback(
		(values?: Array<string | { label: string; description: string }>) => {
			return Array.isArray(values) && typeof values[indexStates[selected]] === 'object';
		},
		[indexStates, selected]
	);

	useNuiEvent('closeMenu', () => closeMenu(true, undefined, true));

	useNuiEvent('setMenu', (data: MenuSettings) => {
		firstRenderRef.current = true;
		if (!data.startItemIndex || data.startItemIndex < 0) data.startItemIndex = 0;
		else if (data.startItemIndex >= data.items.length) data.startItemIndex = data.items.length - 1;
		setSelected(data.startItemIndex);
		if (!data.position) data.position = 'top-left';
		if (setListMenuPosition !== undefined) {
			setListMenuPosition(data.position);
		}
		// listRefs.current = [];
		listRefs.current = listRefs.current.slice(0, data.items.length);
		setMenu(data);
		setVisible(true);
		const arrayIndexes: { [key: number]: number } = {};
		const checkedIndexes: { [key: number]: boolean } = {};
		for (let i = 0; i < data.items.length; i++) {
			if (Array.isArray(data.items[i].values)) arrayIndexes[i] = (data.items[i].defaultIndex || 1) - 1;
			else if (data.items[i].checked !== undefined) checkedIndexes[i] = data.items[i].checked || false;
		}
		setIndexStates(arrayIndexes);
		setCheckedStates(checkedIndexes);
		listRefs.current[data.startItemIndex]?.focus();
	});

	useEffect(() => {
		if (setListMenuOpen === undefined) return;
		setListMenuOpen(visible);
	}, [visible]);

	menu.items.map(
		async(item, index) => {
			if (item && item.icon && typeof(item.icon) === 'string' && item.icon.includes('data:image/')) {
				// item.icon = await autoCrop(item.icon);
				item.icon = item.icon;
			}
			return item;
		}
	);

	return (
		<>
			{visible && (
				<Tooltip
					label={
						isValuesObject(menu.items[selected].values)
							? // @ts-ignore
							halfOpacity(`${menu.items[selected].disabled ? '[DISABLED] ' : ''}${menu.items[selected].values[indexStates[selected]].description}`)
							: halfOpacity(`${menu.items[selected].disabled ? '[DISABLED] ' : ''}${menu.items[selected].description}`)
					}
					opened={
						isValuesObject(menu.items[selected].values)
							? // @ts-ignore
							!!menu.items[selected].values[indexStates[selected]].description
							: !!menu.items[selected].description
					}
					transitionDuration={0}
					classNames={{ tooltip: classes.tooltip }}
				>
					<Box className={`${classes.container} ${classes.wrapTheWrap}`}>
						<Header title={menu.title} />
						<Box className={classes.buttonsWrapper} onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => moveMenu(e)} onKeyUp={(e: React.KeyboardEvent<HTMLDivElement>) => stopMoveMenu(e)}>
							<FocusTrap active={visible}>
								<Stack spacing={8} p={8} sx={{ overflowY: 'scroll' }}>
									{menu.items.map((item, index) => (
										<React.Fragment key={`menu-item-${index}`}>
											{item.label && (
												<ListItem
													index={index}
													item={item}
													scrollIndex={indexStates[index]}
													checked={checkedStates[index]}
													ref={(el) => (listRefs.current[index] = el)}
												/>
											)}
										</React.Fragment>
									))}
								</Stack>
							</FocusTrap>
						</Box>

						<Box className={classes.scrollArrow} style={{ display: 'flex', alignItems: 'center' }}>
							<div style={{ flex: 1 }}></div>
							<Text style={{ textAlign: 'center', flex: 1, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
								{menu.items.length > 6 && selected !== menu.items.length - 1 && (
									<i className={`fa-solid fa-chevron-down`}></i>
								)}
							</Text>
							<Box style={{ flex: 1, paddingRight: '1em', textAlign: 'right' }}>
								<span className={`${classes.bottomBoxes}`} style={{ padding: "0.2em" }}>
									<i className={`fa-solid fa-sort`} style={{ paddingRight: "0.15em" }}></i>
									{selected + 1}/{menu.items.length}
								</span>
							</Box>
						</Box>
					</Box>
				</Tooltip>
			)}
		</>
	);
};

export default ListMenu;
export { ListMenu, ColorText, halfOpacity };