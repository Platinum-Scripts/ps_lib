import React from "react";
import { createStyles } from "@mantine/core";

const useStyles = createStyles((theme) => ({
	toggleOn: {
		color: theme.colors.dark[1],
		"--fa-primary-opacity": 1.0,
		"--fa-primary-color": "#9a8d8d",
		"--fa-secondary-color": "#027602",
		"--fa-secondary-opacity": 1,
	},
	toggleOff: {
		color: theme.colors.dark[3],
		"--fa-primary-opacity": 1.0,
		"--fa-primary-color": "#9a8d8d",
		"--fa-secondary-color": "#af0000",
		"--fa-secondary-opacity": 0.75,
	},
}));

const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
	const { classes } = useStyles();

	return (
		<>
			{checked ? (
				<i className={`${classes.toggleOn} far fa-toggle-on fa-duotone fa-2x`} />
			) : (
				<i className={`${classes.toggleOff} fas fa-2x fa-duotone fa-toggle-on fa-flip-horizontal`}></i>
			)}
		</>
	);
};

export default CustomCheckbox;
