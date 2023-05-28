import { Box, Group, Stack, Text, Progress, Image } from "@mantine/core";
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
			"&:focus": {
				backgroundColor: theme.colors.lighter[3],
				outline: "none",
			},
			maxWidth: 384,
		},
		iconImage: {
			maxWidth: 32,
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
		}
	})
);

const ListItem = forwardRef<HTMLDivElement, Props>(
	({ item, index, scrollIndex, checked }, ref) => {
		const { classes } = useStyles({
			iconColor: item.disabled ? "grey" : item.iconColor,
			rightIconColor: item.rightIconColor,
		});

		const icon = item.disabled ? "fa-lock" : item.icon;

		function convertTitle(text: string) {
			text = titleCase(text);
			return halfOpacity(text);
		}

		return (
			<Box
				tabIndex={item.disabled ? -1 : index} // make untabbable if disabled
				className={`${classes.buttonContainer} ${item.disabled ? classes.disabled : ""
					}`}
				key={`item-${index}`}
				ref={ref}
				style={{ pointerEvents: item.disabled ? "none" : "auto" }} // make unclickable if disabled
			>
				<Group spacing={15} noWrap className={classes.buttonWrapper}>
					{icon && (
						<Box className={classes.iconContainer}>
							{typeof icon === "string" && isIconUrl(icon) ? (
								<img
									src={icon}
									alt="Missing image"
									className={classes.iconImage}
								/>
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
									{convertTitle(item.label)}
								</Text>
								<Textfit min ={12} max = {16}>
									{typeof item.values[scrollIndex] === "object"
										? // @ts-ignore for some reason even checking the type TS still thinks it's a string
										item.values[scrollIndex].label
										: item.values[scrollIndex]}
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
			</Box>
		);
	}
);

export default React.memo(ListItem);
