import { Box, createStyles, Text } from "@mantine/core";
import React from "react";
import { titleCase } from "title-case";
import Textfit from '@namhong2001/react-textfit';
import { ColorText } from ".";

const useStyles = createStyles((theme) => ({
	container: {
		textAlign: "center",
		borderTopLeftRadius: theme.radius.md,
		borderTopRightRadius: theme.radius.md,
		backgroundColor: theme.colors.lighter[1],
		height: 60,
		width: 384,
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		padding: "10%",
	},
	heading: {
		textTransform: "none",
		fontWeight: "bold",
		fontFamily: "Motiva Sans",
		lineHeight: "1.2em",
	},
}));

const Header: React.FC<{ title: string }> = ({ title }) => {
	const { classes } = useStyles();

	return (
		<Box className={classes.container}>
			<Textfit min={18} max = {28} className={classes.heading}>
				{ColorText(titleCase(title))}
			</Textfit>
		</Box>
	);
};

export default React.memo(Header);