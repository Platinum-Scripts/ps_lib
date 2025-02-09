import { NumberInput } from "@mantine/core";
import { INumber } from "../../../../typings/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Control, useController } from "react-hook-form";
import { FormValues } from "../../InputDialog";

interface Props {
	row: INumber;
	index: number;
	control: Control<FormValues>;
}

const NumberField: React.FC<Props> = (props) => {
	const controller = useController({
		name: `test.${props.index}.value`,
		control: props.control,
		defaultValue: props.row.default,
		rules: { required: props.row.required },
	});

	return (
		<NumberInput
			value={controller.field.value}
			name={controller.field.name}
			ref={controller.field.ref}
			onBlur={controller.field.onBlur}
			onChange={controller.field.onChange}
			label={props.row.label}
			description={props.row.description}
			defaultValue={props.row.default}
			min={props.row.min}
			max={props.row.max}
			disabled={props.row.disabled}
			icon={
				props.row.icon && (
					<i className={`fa-solid fa-fw findme ${props.row.icon}`} />
				)
			}
			withAsterisk={props.row.required}
		/>
	);
};

export default NumberField;
