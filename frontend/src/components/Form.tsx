import { Button, TextInput } from "flowbite-react";
import { Dispatch, SetStateAction, useState } from "react";

export enum InputType {
    TEXT = "text",
    EMAIL = "email",
    PASSWORD = "password",
    // NUMBER = "number",
    // DATE = "date",
    // TIME = "time",
    // DATETIME = "datetime-local",
    // CHECKBOX = "checkbox",
    // RADIO = "radio",
    // FILE = "file",
    // SUBMIT = "submit",
    // RESET = "reset",
    // BUTTON = "button",
    // HIDDEN = "hidden",
    // COLOR = "color",
    // RANGE = "range",
    // SEARCH = "search",
    // TEL = "tel",
    // URL = "url",
    // MONTH = "month",
    // WEEK = "week",
    // IMAGE = "image",
    // SELECT = "select",
    // TEXTAREA = "textarea"
}

export type FormInputType = {
    name: string;
    type: InputType;
    label?: string;
}

function FormInput<T>(type: FormInputType, value: T, setState: Dispatch<SetStateAction<T>>) {
    let label = type.label && (
        <label htmlFor={type.name}>
            {type.label}
        </label>
    );
    let input_type = null;
    switch (type.type) {
        case InputType.TEXT:
            input_type = "text";
            break;
        case InputType.EMAIL:
            input_type = "email";
            break;
        case InputType.PASSWORD:
            input_type = "password";
            break;
    }

    let disp_value = value[type.name as keyof T] as string | number | undefined;
    let setValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...value, [type.name]: e.target.value } as T);
    }

    if (disp_value === undefined) {
        disp_value = "";
    }


    return (
        <div>
            {label}
            <TextInput id={type.name} type={input_type} name={type.name} value={disp_value} onChange={setValue} />
        </div>
    )
}

export type FormProps<T> = {
    onSubmit: (value: T) => void;
    value_type: FormInputType[];

    className?: string;
    submit?: string;
    defaultValue?: T;
}

export default function Form<T>(props: FormProps<T>) {
    let [value, setValue] = useState(props.defaultValue ?? {} as T);

    return (
        <div className={props.className}>
            {props.value_type.map((type) => FormInput<T>(type, value, setValue))}
            <Button onClick={() => props.onSubmit(value)} className="w-full mt-4" size="sm">
                {props.submit ?? "Submit"}
            </Button>
        </div>
    )
}