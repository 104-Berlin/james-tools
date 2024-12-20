import { Button, Checkbox, Table } from "flowbite-react";
import EditField from "./EditField";
import { useTranslation } from "react-i18next";
import { ChangeEvent, useState } from "react";

export type DataTableProps = {
    columns: HeaderCell[];
    data: RowData[];

    footer?: RowData;

    resizable?: boolean;

    onAdd?: () => void;
    onDelete?: (row_index: number[]) => void;
    onEdit?: (row_index: number, key: string, value: number | string) => void;
}

export type HeaderCell = {
    // Used to map a row to json
    key: string;

    label: string;

    canEdit?: boolean;
}

export type RowData = {
    id: string;
    [key: string]: string | number | undefined;
}

export default function DataTable(props: DataTableProps) {
    let showSelection = !!props.onDelete;
    let { t } = useTranslation();
    const [selectedRows, setSelectedRows] = useState<number[]>([]);


    return (
        <div>
            <div className="flex justify-start mb-8 mx-4">
                {showSelection && (
                    <div>
                        <Button color="failure" disabled={selectedRows.length === 0} onClick={() => {
                            if (props.onDelete && selectedRows.length > 0) {
                                props.onDelete(selectedRows);
                                setSelectedRows([]);
                            }
                        }}>{`${t("delete")} ${selectedRows.length === 0 ? "" : `(${selectedRows.length})`}`}</Button>
                    </div>
                )}
                <div className="flex-grow" />
                {props.onAdd && (<Button color="blue" onClick={props.onAdd}>{t("add")}</Button>)}
            </div>
            <Table className="max-w-full" hoverable>
                <Table.Head>
                    {showSelection && (
                        <Table.HeadCell className="shrink" key="DataTableHeaderSelection">
                            <Checkbox checked={selectedRows.length === props.data.length && selectedRows.length > 0} onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedRows([...Array(props.data.length).keys()]);
                                } else {
                                    setSelectedRows([]);
                                }
                            }} />
                        </Table.HeadCell>
                    )}
                    {props.columns.map((column) => {
                        return (
                            <Table.HeadCell key={`DataTableHeader_${column.key}`}>
                                {column.label}
                            </Table.HeadCell>
                        )
                    })}
                </Table.Head>
                <Table.Body key="body" className="divide-y divide-x max-w-full overflow-auto">
                    {props.data.map((row, index) => {
                        let row_id = row.id;
                        return (
                            <Table.Row key={`ROW_${row_id}`}
                                className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                {showSelection && (
                                    <Table.Cell className="shrink" key={`${row_id}Checkbox_Cell`} >
                                        <Checkbox checked={selectedRows.find((r) => r === index) != undefined} onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                            if (e.target.checked) {
                                                setSelectedRows([...selectedRows, index]);
                                            } else {
                                                setSelectedRows(selectedRows.filter((r) => r !== index));
                                            }
                                        }} />
                                    </Table.Cell>
                                )
                                }
                                {
                                    props.columns.map((column) => {
                                        return (
                                            <TableCell
                                                key={`${row_id}${column.key}`}
                                                ident={`${row_id}${column.key}`}
                                                input_value={row[column.key] ?? ""}
                                                canEdit={column.canEdit ?? false}
                                                onEdit={(value) => {
                                                    if (props.onEdit) {
                                                        props.onEdit(index, column.key, value);
                                                    }
                                                }} />
                                        )
                                    })
                                }
                            </Table.Row>
                        )
                    })}
                    {props.footer && (
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            {showSelection && (
                                <Table.Cell className="shrink">
                                </Table.Cell>
                            )}
                            {props.columns.map((column) => {
                                return (
                                    <Table.Cell className="text-right" key={`Footer_${column.key}`}>
                                        {column.key === "id" ? "" : props.footer![column.key]}
                                    </Table.Cell>
                                )
                            })}
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
        </div>
    )
}

type TableCellProps = {
    ident: string;
    input_value: string | number;
    canEdit: boolean;
    onEdit: (value: string | number) => void;
}

function TableCell({ ident, input_value, canEdit, onEdit }: TableCellProps) {
    return (
        <Table.Cell>
            {canEdit ? (
                <EditField id={ident} style="normal" alwaysEdit value={input_value} onSubmit={onEdit} />
            ) : (
                <div key={ident}>{input_value}</div>
            )}
        </Table.Cell>
    )
}