import { Button } from "flowbite-react";
import { useEffect, useRef, useState } from "react";

export type EditFieldProps = {
    id: string;
    value: string | number;
    label?: string;

    // Will hide the controlls.
    // When clicking on the text you can start editing.
    minimal?: boolean;

    sizing?: "xs" | "sm" | "md" | "lg";

    onChange: (value: string | number) => void;
}

export default function EditField(props: EditFieldProps) {
    let inputRef = useRef<HTMLInputElement>(null);
    let [editing, setEditing] = useState(false);
    let [editValue, setEditValue] = useState(props.value.toString());

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
            props.onChange(updateValue);
            setEditValue(updateValue.toString())
            setEditing(false);
        };
    }

    useEffect(() => {
        if (editing && inputRef && inputRef.current) {
            inputRef.current?.focus();
        }
    }, [editing]);

    let sizing_class = " p-0 ";
    if (props.sizing) {
        switch (props.sizing!) {
            case "xs":
                sizing_class += "border-none focus:outline-none ";
                break;
            case "sm":
                sizing_class += "w-24 h-8";
                break;
            case "md":
                sizing_class += "w-32 h-8";
                break;
            case "lg":
                sizing_class += "w-48 h-12";
                break
        }
    }


    if (props.minimal && !editing) {
        return <div key={props.id} className="flex min-w-full" onClick={() => { setEditing(true) }}>
            {props.value === "" ? <span className="text-gray-400">Empty</span> : props.value}
        </div>
    }


    return (
        <div key={props.id} className="">
            {props.label ? <label htmlFor={props.id} className="mr-2">{props.label}</label> : null}

            <input
                id={props.id}
                value={editing ? editValue : props.value}
                disabled={!editing}
                onChange={(e) => { setEditValue(e.target.value) }}
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