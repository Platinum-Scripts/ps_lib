import React from "react";
import { useNuiEvent } from "../../hooks/useNuiEvent";
import { Box, createStyles, Group, Text } from "@mantine/core";
import ReactMarkdown from "react-markdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScaleFade from "../../transitions/ScaleFade";
import remarkGfm from "remark-gfm";
import type { TextUiProps, TextUiPosition } from "../../typings";
import { ColorText } from "../menu/list";

const useStyles = createStyles(
	(theme, params: { position?: TextUiPosition }) => ({
		wrapper: {
			height: "100%",
			width: "100%",
			position: "absolute",
			display: "flex",
			alignItems:
				params.position === "top-center" ? "baseline" : "center",
			justifyContent:
				params.position === "right-center"
					? "flex-end"
					: params.position === "left-center"
						? "flex-start"
						: "center",
		},
		container: {
			fontSize: 16,
			padding: 12,
			margin: 8,
			backgroundColor: theme.colors.lighter[1],
			color: theme.colors.dark[0],
			fontFamily: "Roboto",
			borderRadius: theme.radius.sm,
			boxShadow: theme.shadows.sm,
		},
	})
);

const TextUI: React.FC = () => {
	const [data, setData] = React.useState<TextUiProps>({
		text: "",
		position: "right-center",
	});
	const [visible, setVisible] = React.useState(false);
	const { classes } = useStyles({ position: data.position });

	useNuiEvent<TextUiProps>("textUi", (data) => {
		if (!data.position) data.position = "right-center"; // Default right position
		setData(data);
		setVisible(true);
	});

	useNuiEvent("textUiHide", () => setVisible(false));

	return (
		<>
			<Box className={classes.wrapper}>
				<ScaleFade visible={visible}>
					<Box style={data.style} className={classes.container}>
						<Group spacing={12}>
							{data.icon && (
								<i
									className={`fa-solid fa-fw fw-lg findme fa-${data.icon}`}
									style={{ color: data.iconColor }}
								/>
							)}
							{data.text && (
								<Box>
									<Text>{ColorText(data.text)}</Text>
								</Box>
							)}
						</Group>
					</Box>
				</ScaleFade>
			</Box>
		</>
	);
};

export default TextUI;
