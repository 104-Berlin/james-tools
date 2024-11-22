import { Button } from "flowbite-react";
import { useEffect, useRef, useState } from "react";

export type EditFieldProps = {
    value: string | number;
    id?: string;
    label?: string;

    alwaysEdit?: boolean;
    autoFocus?: boolean;

    style: "normal" | "button" | "hidden";

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


    let final_css = "";
    switch (props.style) {
        case "normal":
        case "button":
            final_css = "border rounded-lg p-2 w-full";
            break;
        case "hidden":
            final_css = "p-0 max-w-full border-none focus:outline-none text-sm";
            break;
    }

    let id = props.id ?? "edit_field";
    let pattern = undefined;
    if (type === "number") {
        pattern = "[0-9]*";
    }

    return (
        <div
            onClick={() => { if (props.style !== "button") setEditing(true) }}>
            {props.label ? <label htmlFor={id} className="mr-2 block mb-2 text-sm font-medium text-gray-900 dark:text-white">{props.label}</label> : null}

            <div className={props.style === "button" ? "flex" : ""}>
                <input
                    id={id}
                    value={(editing && !props.onChange) ? editValue : props.value}
                    disabled={!editing}
                    autoFocus={props.autoFocus}
                    onChange={(e) => { handleChange(e.target.value) }}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.currentTarget.blur() } }}
                    onBlur={submit}
                    onSubmit={submit}
                    ref={inputRef}
                    className={final_css}
                    pattern={pattern}
                />

                {(props.style !== "button" || editing) ? null :
                    <Button size="xs" className="flex items-center justify-center" onClick={() => { if (!editing) setEditing(true) }}>Edit</Button>}
            </div>
        </div>
    )
}