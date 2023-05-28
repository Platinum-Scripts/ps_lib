import { Group, Modal, Button, Stack } from "@mantine/core";
import React, { FormEvent } from "react";
import { useNuiEvent } from "../../hooks/useNuiEvent";
import { useLocales } from "../../providers/LocaleProvider";
import { fetchNui } from "../../utils/fetchNui";
import { OptionValue } from "../../typings";
import InputField from "./components/fields/input";
import CheckboxField from "./components/fields/checkbox";
import SelectField from "./components/fields/select";
import NumberField from "./components/fields/number";
import SliderField from "./components/fields/slider";
import { useFieldArray, useForm } from "react-hook-form";
import ColorField from "./components/fields/color";
import DateField from "./components/fields/date";
import TextareaField from "./components/fields/textarea";
import TimeField from "./components/fields/time";
import type { InputProps } from "../../typings";

export type FormValues = {
	test: {
		value: any;
	}[];
};

const InputDialog: React.FC = () => {
	const [fields, setFields] = React.useState<InputProps>({
		heading: "",
		rows: [{ type: "input", label: "" }],
	});
	const [visible, setVisible] = React.useState(false);
	const { locale } = useLocales();

	const form = useForm<{ test: { value: any }[] }>({});
	const fieldForm = useFieldArray({
		control: form.control,
		name: "test",
	});

	const { watch } = form;
	const watchAllFields = watch();

	const [watchables, setWatchables] = React.useState<boolean>(false);
	const [cbe, setCbe] = React.useState<string>("");
	const [lastWatch, setLastWatch] = React.useState<any>(null);

	useNuiEvent<InputProps>("openDialog", (data) => {
		setFields(data);
		setVisible(true);
		data.rows.forEach((row, index) => {
			fieldForm.insert(
				index,
				{
					value:
						row.type !== "checkbox"
							? row.type === "date" ||
								row.type === "date-range" ||
								row.type === "time"
								? // Set date to current one if default is set to true
								row.default === true
									? new Date().getTime()
									: Array.isArray(row.default)
										? row.default.map((date) =>
											new Date(date).getTime()
										)
										: row.default &&
										new Date(row.default).getTime()
								: row.default
							: row.checked,
				} || { value: null }
			);
			// Backwards compat with new Select data type
			if (row.type === "select" || row.type === "multi-select") {
				row.options = row.options.map((option) =>
					!option.label ? { ...option, label: option.value } : option
				) as Array<OptionValue>;
			}
		});

		if (data.options?.onRowUpdate) {
			// update watchables
			setWatchables(true);
			setCbe(data.options?.cbe || "");
		} else {
			setWatchables(false);
			setCbe("");
		}
	});

	useNuiEvent("closeInputDialog", () => {
		setVisible(false);
	});

	const handleClose = async () => {
		setVisible(false);
		await new Promise((resolve) => setTimeout(resolve, 200));
		form.reset();
		fieldForm.remove();
		fetchNui("inputData");
	};

	const onSubmit = form.handleSubmit(async (data) => {
		setVisible(false);
		const values: any[] = [];
		Object.values(data.test).forEach((obj: { value: any }) =>
			values.push(obj.value)
		);
		await new Promise((resolve) => setTimeout(resolve, 200));
		form.reset();
		fieldForm.remove();
		fetchNui("inputData", values);
	});


	// create a function that will create a timeout for 50 ms to send the cbe to the server, but if it is called again, it will clear the timeout and create a new one that is 1/5 of the time. do not go under 5ms.
	const stageCbe = function (cbe: string) {
		if (lastWatch === null) return function() {} // if last watch is null, return a function that does nothing

		let timeout: any;
		let delay = 50;
		let start = Date.now();

		return function () {
			clearTimeout(timeout);

			let secondsElapsed = (Date.now() - start) / 1000;
			delay /= Math.pow(2, secondsElapsed);
			if (delay < 6) {
				delay = 6;
			}

			timeout = setTimeout(() => {
				fetchNui(cbe, lastWatch).catch();
				start = Date.now();
			}, delay);
		};
	};

	React.useEffect(() => {
		if (!watchables || !visible || !watchAllFields || cbe === "" || !watchAllFields.test) {
			return;
		} else {
			if (watchAllFields && watchAllFields.test) {
				let values = Object.values(watchAllFields.test).map(
					(obj: { value: any }) => obj.value
				);

				if (lastWatch !== values) {
					if (lastWatch === null) {
						setLastWatch(values);
						// fetchNui(cbe, watchAllFields)
						stageCbe(cbe)();
						return;
					} else {
						let diff = [];
						// loop each value and compare to last watch
						lastWatch.forEach((value: any, index: number) => {
							if (value !== values[index]) {
								diff.push({
									index: index,
									value: values[index],
								});
							}
						});

						// if there is a difference, send it to the server
						if (diff.length > 0) {
							setLastWatch(values);
							// fetchNui(cbe, watchAllFields)
							stageCbe(cbe)();
						}
					}
				}
			}
		}
	}, [watchAllFields]);

	return (
		<>
			<Modal
				opened={visible}
				onClose={handleClose}
				centered
				closeOnEscape={fields.options?.allowCancel !== false}
				closeOnClickOutside={false}
				size="xs"
				styles={{
					title: { textAlign: "center", width: "100%", fontSize: 18 },
				}}
				title={fields.heading}
				withCloseButton={false}
				overlayOpacity={0.5}
				transition="fade"
				exitTransitionDuration={150}
			>
				<form onSubmit={onSubmit}>
					<Stack>
						{fieldForm.fields.map((item, index) => {
							const row = fields.rows[index];
							return (
								<React.Fragment key={item.id}>
									{row.type === "input" && (
										<InputField
											register={form.register(
												`test.${index}.value`,
												{ required: row.required }
											)}
											row={row}
											index={index}
										/>
									)}
									{row.type === "checkbox" && (
										<CheckboxField
											register={form.register(
												`test.${index}.value`,
												{ required: row.required }
											)}
											row={row}
											index={index}
										/>
									)}
									{(row.type === "select" ||
										row.type === "multi-select") && (
											<SelectField
												row={row}
												index={index}
												control={form.control}
											/>
										)}
									{row.type === "number" && (
										<NumberField
											control={form.control}
											row={row}
											index={index}
										/>
									)}
									{row.type === "slider" && (
										<SliderField
											control={form.control}
											row={row}
											index={index}
										/>
									)}
									{row.type === "color" && (
										<ColorField
											control={form.control}
											row={row}
											index={index}
										/>
									)}
									{row.type === "time" && (
										<TimeField
											control={form.control}
											row={row}
											index={index}
										/>
									)}
									{row.type === "date" ||
										row.type === "date-range" ? (
										<DateField
											control={form.control}
											row={row}
											index={index}
										/>
									) : null}
									{row.type === "textarea" && (
										<TextareaField
											register={form.register(
												`test.${index}.value`,
												{ required: row.required }
											)}
											row={row}
											index={index}
										/>
									)}
								</React.Fragment>
							);
						})}
						<Group position="right" spacing={10}>
							<Button
								uppercase
								variant="default"
								onClick={handleClose}
								mr={3}
								disabled={fields.options?.allowCancel === false}
							>
								{locale.ui.cancel}
							</Button>
							<Button uppercase variant="light" type="submit">
								{locale.ui.confirm}
							</Button>
						</Group>
					</Stack>
				</form>
			</Modal>
		</>
	);
};

export default InputDialog;
