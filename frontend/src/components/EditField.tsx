import { Button, TextInput } from "flowbite-react";
import { useState } from "react";

export type EditFieldProps = {
    value: string;
    onChange: (value: string) => void;
}

export default function EditField(props: EditFieldProps) {
    let [editing, setEditing] = useState(false);
    let [editValue, setEditValue] = useState(props.value);

    const submit = () => {
        if (editing) {
            props.onChange(editValue);
            setEditing(false);
            setEditValue(props.value);
        }
    };

    return (
        <div className="flex">
            <TextInput
                value={editing ? editValue : props.value}
                disabled={!editing}
                onChange={(e) => { setEditValue(e.target.value) }}
                onKeyDown={(e) => { if (e.key === "Enter") { submit() } }}
                onBlur={submit}
                onSubmit={submit}
                sizing="sm"
                className="w-full" />
            <Button size="xs" className="flex items-center justify-center" disabled={editing} onClick={() => { setEditing(true) }}>Edit</Button>
        </div >
    )
}