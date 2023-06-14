import { Box, Group, Stack, Text, Progress, Image, Avatar } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { forwardRef } from "react";
import CustomCheckbox from "./CustomCheckbox";
import type { MenuItem } from "../../../typings";
import { createStyles } from "@mantine/core";
import { isIconUrl } from "../../../utils/isIconUrl";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { titleCase } from "title-case";
import Textfit from '@namhong2001/react-textfit';
import { ColorText, halfOpacity } from ".";
import "./pulse.css";

interface Props {
	item: MenuItem;
	index: number;
	scrollIndex: number;
	checked: boolean;
	ref: React.Ref<HTMLDivElement>; // Change the type to React.Ref<HTMLDivElement>
}

const useStyles = createStyles(
	(
		theme,
		params: {
			rightIconColor?: string;
			iconColor?: string;
		}
	) => ({
		buttonContainer: {
			backgroundColor: theme.colors.lighter[1],
			borderRadius: theme.radius.md,
			padding: 2,
			height: 60,
			scrollMargin: 8,
			transition: 'box-shadow 0.3s ease-in-out', // Added transition for smooth effect
			"&:focus": {
				backgroundColor: theme.colors.lighter[3],
				outline: "none",
				boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", // Reduced shadow blur and opacity
			},
			maxWidth: 384,
		},
		iconImage: {
			maxWidth: 42,
			maxHeight: 32,
			backgroundColor: "transparent",
			borderRadius: 32,
			// center the image in the icon container
		},
		buttonWrapper: {
			paddingLeft: 5,
			paddingRight: 12,
			height: "100%",
			maxWidth: 368,
		},
		iconContainer: {
			display: "flex",
			alignItems: "center",
			width: 32,
			height: 32,
			backgroundColor: "transparent",
		},
		icon: {
			fontSize: 24,
			color: params.iconColor || theme.colors.lighter[0],
		},
		rightIcon: {
			fontSize: "1.5em",
			color: params.rightIconColor || theme.colors.lighter[0],
		},
		label: {
			color: theme.colors.lighter[0],
			textTransform: "none",
			fontSize: 12,
			verticalAlign: "middle",
		},
		chevronIcon: {
			fontSize: 14,
			color: theme.colors.lighter[0],
		},
		scrollIndexValue: {
			color: theme.colors.lighter[0],
			textTransform: "none",
			fontSize: 14,
		},
		progressStack: {
			width: "100%",
			marginRight: 5,
		},
		progressLabel: {
			verticalAlign: "middle",
			marginBottom: 3,
		},
		disabled: {
			color: "grey",
			opacity: 0.5,
		},
		textContainer: {
			maxWidth: 221,
			minWidth: 0,  // This will prevent the text from pushing other items out
			overflow: 'hidden',  // This will prevent the text from spilling over outside the container
		},
		"50": {
			// 50% opacity
			opacity: 0.5,
		},
		colorSwatch: {
			height: "15px",
			width: "15px",
			outline: "none",
			borderRadius: "3px",
		},
		focused: {
			animation: "pulse 2s infinite",
			position: 'absolute',
			height: '100%',
			width: '4px',
			right: '5px', // adjust the position from the right to match your rightIcon's position
			backgroundColor: theme.colors.blue[5],
			borderRadius: '0 5px 5px 0', // Only apply the border radius to the right side.
		},
	})
);

const ListItem = forwardRef<HTMLDivElement, Props>(
	({ item, index, scrollIndex, checked }, ref) => {
		const [isFocused, setIsFocused] = React.useState(false);

		const { classes } = useStyles({
			iconColor: item.disabled ? "grey" : item.iconColor,
			rightIconColor: item.rightIconColor,
		});

		const icon = item.disabled ? "fa-lock" : item.icon;

		function convertTitle(text: string) {
			text = titleCase(text);
			return halfOpacity(text);
		}

		function sliderLabel(text: string) {
			const regex = /<lib:cswatch:sq:rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)>/;
			const matches = regex.exec(text);
			if (matches) {
				// remove match from text
				text = text.replace(regex, "").trim();
				const rgb = {
					red: parseInt(matches[1]),
					green: parseInt(matches[2]),
					blue: parseInt(matches[3])
				};
				return (
					<div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", flexWrap: "nowrap" }}>
						<span>{text}</span>
						<div className={`${classes.colorSwatch}`} style={{ backgroundColor: `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`, marginLeft: "10px" }} />
					</div>
				);
			} else {
				return text;
			}
		}

		return (
			<Box
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				tabIndex={item.disabled ? -1 : index} // make untabbable if disabled
				className={`${classes.buttonContainer} ${item.disabled ? classes.disabled : ""
					}`}
				key={`item-${index}`}
				ref={ref}
				style={{ pointerEvents: item.disabled ? "none" : "auto" }} // make unclickable if disabled
			>
				<div style={{ position: 'relative', height: '100%' }}>
					{isFocused && <div className={classes.focused} />}
					<Group spacing={15} noWrap className={classes.buttonWrapper}>
						{icon && (
							<Box className={classes.iconContainer}>
								{typeof icon === "string" && isIconUrl(icon) ? (
									<Avatar
										radius="xl"
										size={38}
										imageProps={{
											style: {
												backgroundColor: "transparent",
												objectFit: "contain"
											}
										}}
										src={icon}
									>
									</Avatar>
								) : (
									<i
										className={`fa-solid fa-fw findme ${icon} ${classes.icon}`}
									/>
								)}
							</Box>
						)}
						{Array.isArray(item.values) ? (
							<Group position="apart" w="100%">
								<Stack spacing={0} justify="space-between" className={classes.textContainer}>
									<Text className={`${classes.label}`} style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
										{/* Title */}
										{convertTitle(item.label)}
									</Text>
									<Textfit min={12} max={16}>
										{
											// @ts-ignore
											sliderLabel(
												// @ts-ignore
												typeof item.values[scrollIndex] === "object" && 'label' in item.values[scrollIndex]
													// @ts-ignore
													? item.values[scrollIndex].label
													// @ts-ignore
													: item.values[scrollIndex]
											)
										}
									</Textfit>
								</Stack>

								<Group spacing={1} position="center">
									<i className={`fa-solid fa-chevron-left`}></i>
									<Text className={classes.scrollIndexValue}>
										{scrollIndex + 1}/{item.values.length}
									</Text>
									<i className={`fa-solid fa-chevron-right`}></i>
								</Group>
							</Group>
						) : item.checked !== undefined ? (
							<Group position="apart" w="100%">
								<Text className={`${classes.textContainer}`}>{ColorText(item.label)}</Text>
								<CustomCheckbox checked={checked}></CustomCheckbox>
							</Group>
						) : item.progress !== undefined ? (
							<Stack className={`${classes.progressStack}`} spacing={0}>
								<Text className={`${classes.progressLabel} ${classes.textContainer}`}>
									{ColorText(item.label)}
								</Text>
								<Progress
									value={item.progress}
									color={item.colorScheme || "dark.0"}
									styles={(theme) => ({
										root: {
											backgroundColor: theme.colors.dark[3],
										},
									})}
								/>
							</Stack>
						) : item.rightIcon !== undefined ? (
							<Group position="apart" w="100%">
								<Text className={classes.textContainer}>{ColorText(item.label)}</Text>
								<i
									className={`fa-fw ${item.rightIcon} ${classes.rightIcon}`}
								></i>
							</Group>
						) : (
							<Text>{convertTitle(item.label)}</Text>
						)}
					</Group>
				</div>
			</Box>
		);
	}
);

export default React.memo(ListItem);