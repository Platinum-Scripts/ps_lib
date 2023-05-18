import React from "react";
import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
	toggleOn: {
		color: theme.colors.dark[1],
	},
	toggleOff: {
		color: theme.colors.dark[3],
	},
}));

const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
	const { classes } = useStyles();

	return (
		<>
			{checked ? (
				<i className={`${classes.toggleOn} far fa-toggle-on fa-2x`} />
			) : (
				<i className={`${classes.toggleOff} fas fa-toggle-off fa-2x`} />
			)}
		</>
	);
};

export default CustomCheckbox;
