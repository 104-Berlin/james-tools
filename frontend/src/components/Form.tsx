import { Button, TextInput } from "flowbite-react";
import { useState } from "react";

export enum InputType {
    TEXT = "text",
    EMAIL = "email",
    PASSWORD = "password",
    NUMBER = "number",
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
    key: string;
    type: InputType;
    label?: string;
    placeholder?: string;
}

export function FormInput(type: FormInputType, value: string | number | undefined, onUpdate: (value: number | string | undefined) => void) {
    let label = type.label && (
        <label htmlFor={type.key}>
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
        case InputType.NUMBER:
            input_type = "number";
            break;
    }

    let [displayValue, setDisplayValue] = useState(value?.toString());

    let setValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayValue(e.target.value);
    }

    let submit = () => {
        let currentValue: string | number | undefined = displayValue;

        if (type.type === InputType.NUMBER) {
            currentValue = parseFloat(displayValue ?? "0");
            if (displayValue?.length === 0) {
                currentValue = 0;
            }

            if (isNaN(currentValue)) {
                currentValue = value;
            }
        }
        setDisplayValue(currentValue?.toString());
        onUpdate(currentValue);
    };

    if (displayValue === undefined) {
        displayValue = "";
        if (type.type === InputType.NUMBER) {
            displayValue = "0";
        }
    }


    return (
        <div key={type.key}>
            {label}
            <TextInput
                id={type.key}
                key={type.key}
                type={input_type}
                name={type.key}
                value={displayValue}
                placeholder={type.placeholder}
                onChange={setValue}
                onBlur={submit}
                onKeyDown={(e) => { if (e.key === 'Enter') { submit() } }}
                onSubmit={submit} />
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

    const updateValue = (key: string) => (value: string | number | undefined) => {
        setValue((prev) => {
            return {
                ...prev,
                [key]: value
            } as T;
        });
    }

    return (
        <div className={props.className}>
            {props.value_type.map((type) => {
                let value = (props.defaultValue as any)?.[type.key];
                return FormInput(type, value, updateValue(type.key));
            })}
            <Button onClick={() => props.onSubmit(value)} className="w-full mt-4" size="sm">
                {props.submit ?? "Submit"}
            </Button>
        </div>
    )
}