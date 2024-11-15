import { Button } from "flowbite-react";
import { useEffect, useRef, useState } from "react";

export type EditFieldProps = {
    value: string | number;
    id?: string;
    label?: string;

    // Will hide the controlls.
    // When clicking on the text you can start editing.
    minimal?: boolean;

    alwaysEdit?: boolean;
    autoFocus?: boolean;

    sizing?: "xs" | "sm" | "md" | "lg";

    onSubmit?: (value: string | number) => void;
    onChange?: (value: string | number) => void;
}

export default function EditField(props: EditFieldProps) {
    let inputRef = useRef<HTMLInputElement>(null);

    let [editValue, setEditValue] = useState(props.value.toString());
    let [isediting, setEditing] = useState(false);
    let editing = isediting || !!props.alwaysEdit

    let type = "text";
    if (typeof props.value === "number") {
        type = "number";
    }

    const submit = () => {
        if (editing) {
            let updateValue: number | string = editValue;
            if (type == "number") {
                let num = parseFloat(editValue === "" ? "0" : editValue);
                if (isNaN(num)) {
                    updateValue = props.value;
                } else {
                    updateValue = num;
                }
            }
            props.onSubmit?.(updateValue);
            props.onChange?.(updateValue);
            setEditValue(updateValue.toString())
            setEditing(false);
        };
    }

    const handleChange = (value: string) => {
        setEditValue(value);
        let changeValue: string | number = value;
        if (type === "number") {
            changeValue = parseFloat(value === "" ? "0" : value);
        }
        props.onChange?.(changeValue);
    };

    useEffect(() => {
        if (editing && inputRef && inputRef.current && !props.alwaysEdit) {
            inputRef.current?.focus();
        }
    }, [editing]);

    let sizing_class = " border rounded-lg ";
    let sizing_class_div = "m-4";
    switch (props.sizing ?? "md") {
        case "xs":
            sizing_class += " p-0 max-w-full border-none focus:outline-none ";
            sizing_class_div = "m-0"
            break;
        case "sm":
            sizing_class += " w-full m-w-24 h-8";
            break;
        case "md":
            sizing_class += " w-full m-w-32 h-8";
            break;
        case "lg":
            sizing_class += " w-full min-w-48 h-12";
            break
    }


    if (props.minimal && !editing) {
        return <div className="flex min-w-full" onClick={() => { setEditing(true) }}>
            {props.value === "" ? <span className="text-gray-400">Empty</span> : props.value}
        </div>
    }

    let id = props.id ?? "edit_field";

    return (
        <div className={sizing_class_div}>
            {props.label ? <label htmlFor={id} className="mr-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">{props.label}</label> : null}

            <input
                id={id}
                value={editing ? editValue : props.value}
                disabled={!editing}
                autoFocus={props.autoFocus}
                onChange={(e) => { handleChange(e.target.value) }}
                onKeyDown={(e) => { if (e.key === "Enter") { submit() } }}
                onBlur={submit}
                onSubmit={submit}
                ref={inputRef}
                className={"text-sm " + sizing_class}
            />

            {(!!props.minimal || editing) ? null :
                <Button size="xs" className="flex items-center justify-center" onClick={() => { if (!editing) setEditing(true) }}>Edit</Button>}
        </div>
    )
}