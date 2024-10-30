import { Button, TextInput } from "flowbite-react";

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

function FormInput(type: FormInputType) {
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

    return (
        <div>
            {label}
            <TextInput id={type.name} type={input_type} name={type.name} />
        </div>
    )
}

export type FormProps<T> = {
    onSubmit: (value: T) => void;
    value_type: FormInputType[];

    className?: string;
    submit?: string;
}

export default function Form<T>(props: FormProps<T>) {
    return (
        <div className={props.className}>
            {props.value_type.map((type) => FormInput(type))}
            <Button onClick={() => props.onSubmit({} as T)} className="w-full mt-4" size="sm">
                {props.submit ?? "Submit"}
            </Button>
        </div>
    )
}