import { Table } from "flowbite-react";
import EditField from "./EditField";

export type DataTableProps = {
    columns: HeaderCell[];
    data: RowData[];

    resizable?: boolean;

    onDelete?: (row_index: number) => {};
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
    return (
        <Table className="table-fixed" hoverable>
            <Table.Head>
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
                        <Table.Row key={`DataTableRow_${index}`}
                            className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            {props.columns.map((column) => {
                                return (
                                    <TableCell ident={`DataTableRow_${index}___Cell_${column.key}`}
                                        input_value={row[column.key] ?? ""}
                                        canEdit={column.canEdit ?? false}
                                        onEdit={(value) => {
                                            if (props.onEdit) {
                                                props.onEdit(index, column.key, value);
                                            }
                                        }} />
                                )
                            })}
                        </Table.Row>
                    )
                })}
            </Table.Body>
        </Table>
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
        <Table.Cell key={ident}>
            <div className="">
                {canEdit ? (
                    <EditField key={ident} sizing="xs" minimal value={input_value} onChange={onEdit} />
                ) : (
                    <div key={ident}>{input_value}</div>
                )}
            </div>
        </Table.Cell>
    )
}