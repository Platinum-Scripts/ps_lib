import { Button, createStyles } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface Props {
	icon: IconProp;
	canClose?: boolean;
	iconSize: number;
	handleClick: () => void;
}

const useStyles = createStyles((theme, params: { canClose?: boolean }) => ({
	button: {
		borderRadius: 4,
		flex: "1 15%",
		alignSelf: "stretch",
		height: "auto",
		textAlign: "center",
		justifyContent: "center",
		padding: 2,
	},
	root: {
		border: "none",
	},
	label: {
		color:
			params.canClose === false
				? theme.colors.lighter[0]
				: theme.colors.dark[0],
	},
}));

const HeaderButton: React.FC<Props> = ({
	icon,
	canClose,
	iconSize,
	handleClick,
}) => {
	const { classes } = useStyles({ canClose });

	return (
		<Button
			variant="default"
			className={classes.button}
			classNames={{ label: classes.label, root: classes.root }}
			disabled={canClose === false}
			onClick={handleClick}
		>
			<i
				className={`fa-solid fa-fw findme ${icon}`}
				style={{ fontSize: iconSize }}
			/>
		</Button>
	);
};

export default HeaderButton;
