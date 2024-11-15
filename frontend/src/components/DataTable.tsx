import { Button, Checkbox, Table } from "flowbite-react";
import EditField from "./EditField";
import { useTranslation } from "react-i18next";
import { ChangeEvent, useState } from "react";

export type DataTableProps = {
    columns: HeaderCell[];
    data: RowData[];

    resizable?: boolean;

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
    [key: string]: string | number | undefined;
}

export default function DataTable(props: DataTableProps) {
    let showSelection = !!props.onDelete;
    let { t } = useTranslation();
    const [selectedRows, setSelectedRows] = useState<number[]>([]);


    return (
        <div>
            <div className="flex justify-start">
                {showSelection && (
                    <div>
                        <Button color="failure" onClick={() => {
                            if (props.onDelete && selectedRows.length > 0) {
                                props.onDelete(selectedRows);
                                setSelectedRows([]);
                            }
                        }}>{`${t("delete")} (${selectedRows.length})`}</Button>
                    </div>
                )}
            </div>
            <Table className="table-fixed" hoverable>
                <Table.Head>
                    {showSelection && (
                        <Table.HeadCell key="DataTableHeaderSelection">
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
                <Table.Body className="divide-y divide-x">
                    {props.data.map((row, index) => {
                        return (
                            <Table.Row key={index}
                                className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                {showSelection && (
                                    <Table.Cell key={`${index}Checkbox_Cell`} >
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
                                            <TableCell ident={`${index}${column.key}`}
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
        <Table.Cell id={ident} key={ident}>
            {canEdit ? (
                <EditField id={ident} sizing="xs" minimal value={input_value} onChange={onEdit} />
            ) : (
                <div key={ident}>{input_value}</div>
            )}
        </Table.Cell >
    )
}