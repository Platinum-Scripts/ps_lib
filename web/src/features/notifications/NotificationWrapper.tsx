import { useNuiEvent } from "../../hooks/useNuiEvent";
import { toast, Toaster, ToastPosition } from "react-hot-toast";
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
import React, { Children, useContext, useEffect, useState } from "react";
import type { NotificationProps } from "../../typings";
import { ListMenuContext } from "../../App";
import { ColorText } from "../menu/list";

async function autoCrop(url: string) {
	return new Promise((resolve, reject) => {
		if (!url.startsWith("data:image/")) {
			resolve(url);
			return;
		}

		const img = new Image();
		img.src = url;

		img.onload = function() {
			const canvas = document.createElement('canvas');
			const context = canvas.getContext('2d');
			if (!context) {
				reject(new Error('Could not get context'));
				return;
			}
			
			canvas.width = img.width;
			canvas.height = img.height;
			context.drawImage(img, 0, 0, img.width, img.height);

			const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
			const data = imageData.data;

			let top = 0, bottom = canvas.height, left = 0, right = canvas.width;
			let rowEmpty = (rowIndex: number) => {
				for(let x = 0; x < canvas.width; x++)
					if(data[(rowIndex*canvas.width+x)*4+3] !== 0)
						return false;
				return true;
			};
			let colEmpty = (colIndex: number) => {
				for(let y = 0; y < canvas.height; y++)
					if(data[(y*canvas.width+colIndex)*4+3] !== 0)
						return false;
				return true;
			};

			// loop pixels, if pixel is 85% transparent, make it fully transparent
			for (let i = 0; i < data.length; i += 4) {
				if (data[i + 3] <= 100) {
					data[i + 3] = 0;
				}
			}

			// put img data back on canvas
			context.putImageData(imageData, 0, 0);
			
			while(top < bottom && rowEmpty(top))
				top++;
			while(bottom > top && rowEmpty(bottom-1))
				bottom--;
			while(left < right && colEmpty(left))
				left++;
			while(right > left && colEmpty(right-1))
				right--;

			const croppedCanvas = document.createElement('canvas');
			croppedCanvas.width = right-left;
			croppedCanvas.height = bottom-top;
			let tempContext = croppedCanvas.getContext('2d');
			if (!tempContext) {
				reject(new Error('Could not get context'));
				return;
			}

			tempContext.drawImage(canvas, left, top, right-left, bottom-top, 0, 0, right-left, bottom-top);

			resolve(croppedCanvas.toDataURL());
		};

		img.onerror = function() {
			reject(new Error('Could not load image at ' + url));
		};
	});
};

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
	avatar: {
		backgroundColor: theme.colors.lighter[1],
	}
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

	async function notify(data: NotificationProps) {
		if (!data.title && !data.description) return;

		// Backwards compat with old notifications
		let position = data.position || "top-right";
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
		} else if (!data.icon.startsWith("fa-") && !data.icon.startsWith("data:image/")) {
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

		// if (!(typeof position === "string" && position.includes("center")))
		// 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
		if (!(typeof position === "string" && position === "top-left" || position === "top-center" || position === "top-right" || position === "bottom-left" || position === "bottom-center" || position === "bottom-right"))
			position = "top-right";

		let Position: ToastPosition = position as ToastPosition || "top-right";

		if (data.icon && data.icon.startsWith("data:image")) {
			autoCrop(data.icon).then((res) => {
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
												size={42}
												style={{
													backgroundColor: "transparent",
												}}
												src={res||data.icon}
											>
												{(!data.icon.startsWith("data:image/")) && (
												<i
													className={`fa-solid fa-fw fa-lg findme ${data.icon}`}
												/>
												)}
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
						duration: data.duration || 5000,
						position: Position
					}
				);
			});
		} else {
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
											className={classes.avatar}
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
					position: position
				}
			);
		}
	}

	useNuiEvent<NotificationProps>("notify", async (data) => {
		notify(data);
	});

	return <Toaster />;
};

// we need to expoet Notifications and autoCrop
export { Notifications, autoCrop };
// default export is Notifications
export default Notifications;