import { useNuiEvent } from "../../hooks/useNuiEvent";
import { toast, Toaster } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactMarkdown from "react-markdown";
import {
	Avatar,
	createStyles,
	Group,
	Stack,
	Box,
	Text,
	keyframes,
} from "@mantine/core";
import React, { Children, useContext, useEffect } from "react";
import type { NotificationProps } from "../../typings";
import { ListMenuContext } from "../../App";
import { ColorText } from "../menu/list";

const useStyles = createStyles((theme) => ({
	container: {
		width: 300,
		height: "fit-content",
		backgroundColor: theme.colors.lighter[1],
		color: theme.colors.dark[0],
		padding: 12,
		borderRadius: theme.radius.sm,
		fontFamily: "Roboto",
		boxShadow: theme.shadows.sm,
	},
	title: {
		fontWeight: 500,
		lineHeight: "normal",
	},
	description: {
		fontSize: 12,
		color: theme.colors.lighter[0],
		fontFamily: "Roboto",
		lineHeight: "normal",
	},
	descriptionOnly: {
		fontSize: 14,
		color: theme.colors.lighter[0],
		fontFamily: "Roboto",
		lineHeight: "normal",
	},
}));

// I hate this
const enterAnimationTop = keyframes({
	from: {
		opacity: 0,
		transform: "translateY(-30px)",
	},
	to: {
		opacity: 1,
		transform: "translateY(0px)",
	},
});

const enterAnimationBottom = keyframes({
	from: {
		opacity: 0,
		transform: "translateY(30px)",
	},
	to: {
		opacity: 1,
		transform: "translateY(0px)",
	},
});

const exitAnimationTop = keyframes({
	from: {
		opacity: 1,
		transform: "translateY(0px)",
	},
	to: {
		opacity: 0,
		transform: "translateY(-100%)",
	},
});

const exitAnimationRight = keyframes({
	from: {
		opacity: 1,
		transform: "translateX(0px)",
	},
	to: {
		opacity: 0,
		transform: "translateX(100%)",
	},
});

const exitAnimationLeft = keyframes({
	from: {
		opacity: 1,
		transform: "translateX(0px)",
	},
	to: {
		opacity: 0,
		transform: "translateX(-100%)",
	},
});

const exitAnimationBottom = keyframes({
	from: {
		opacity: 1,
		transform: "translateY(0px)",
	},
	to: {
		opacity: 0,
		transform: "translateY(100%)",
	},
});

const Notifications: React.FC = () => {
	const listMenuContext = useContext(ListMenuContext);

	const isListMenuOpen = listMenuContext?.isListMenuOpen || false;
	const setListMenuOpen = listMenuContext?.setListMenuOpen;
	const listMenuPosition = listMenuContext?.listMenuPosition || "top-left";
	const setListMenuPosition = listMenuContext?.setListMenuPosition;

	const { classes } = useStyles();

	useNuiEvent<NotificationProps>("notify", (data) => {
		if (!data.title && !data.description) return;
		// Backwards compat with old notifications
		let position = data.position;
		switch (position) {
			case "top":
				position = "top-center";
				break;
			case "bottom":
				position = "bottom-center";
				break;
			case undefined:
				position = "top-right";
				break;
		}
		if (!data.icon) {
			switch (data.type) {
				case "error":
					data.icon = "fa-circle-xmark";
					break;
				case "success":
					data.icon = "fa-circle-check";
					break;
				case "warning":
					data.icon = "fa-circle-exclamation";
					break;
				default:
					data.icon = "fa-circle-info";
					break;
			}
		} else if (!data.icon.startsWith("fa-")) {
			data.icon = `fa-${data.icon}`;
		}

		if (
			position &&
			typeof position === "string" &&
			listMenuPosition &&
			typeof listMenuPosition === "string"
		) {
			switch (listMenuPosition) {
				case "top-left":
					if (position === "top-left") {
						position = "top-center";
					}
					break;
				case "top-right":
					if (position === "top-right") {
						position = "top-center";
					}
					break;
				case "bottom-left":
					if (position === "bottom-left") {
						position = "bottom-center";
					}
					break;
				case "bottom-right":
					if (position === "bottom-right") {
						position = "bottom-center";
					}
					break;
				default:
					break;
			}
		}

		toast.custom(
			(t) => (
				<Box
					sx={{
						animation: t.visible
							? `${position?.includes("bottom")
								? enterAnimationBottom
								: enterAnimationTop
							} 0.2s ease-out forwards`
							: `${position?.includes("right")
								? exitAnimationRight
								: position?.includes("left")
									? exitAnimationLeft
									: position === "top-center"
										? exitAnimationTop
										: position
											? exitAnimationBottom
											: exitAnimationRight
							} 0.4s ease-in forwards`,
					}}
					style={data.style}
					className={`${classes.container}`}
				>
					<Group noWrap spacing={12}>
						{data.icon && (
							<>
								{!data.iconColor ? (
									<Avatar
										color={
											data.type === "error"
												? "red"
												: data.type === "success"
													? "teal"
													: data.type === "warning"
														? "yellow"
														: "blue"
										}
										radius="xl"
										size={32}
									>
										<i
											className={`fa-solid fa-fw fa-lg findme ${data.icon}`}
										/>
									</Avatar>
								) : (
									<i
										className={`fa-solid fa-fw fa-lg findme ${data.icon}`}
										style={{ color: data.iconColor }}
									/>
								)}
							</>
						)}
						<Stack spacing={0}>
							{data.title && (
								<Text className={classes.title}>
									{ColorText(data.title)}
								</Text>
							)}
							{data.description && (
								<Box
									className={
										!data.title
											? classes.descriptionOnly
											: classes.description
									}
								>
									<Text>{ColorText(data.description)}</Text>
								</Box>
							)}
						</Stack>

					</Group>
				</Box>
			),
			{
				id: data.id?.toString(),
				duration: data.duration || 3000,
				position: position,
			}
		);
	});

	return <Toaster />;
};

export default Notifications;