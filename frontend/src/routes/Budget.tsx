import { Tabs } from "flowbite-react";
import { useTranslation } from "react-i18next";
import Form, { FormInputType, InputType } from "../components/Form";
import { addMonthly, Monthly as TMonthly, getMonthly, updateMonthly, deleteMonthly } from "../api/Budget";
import { useEffect, useState } from "react";
import DataTable from "../components/DataTable";


export default function Budget() {
    let { t } = useTranslation("budget");

    return (
        <div className="flex flex-col justify-center items-center p-4">
            <h1 className="font-extrabold text-3xl p-8">Budget</h1>
            <Tabs variant="pills" className="w-full items-center justify-center">
                <Tabs.Item title={t("overview")}>
                    <Overview />
                </Tabs.Item>
                <Tabs.Item title={t("monthly")}>
                    <Monthly />
                </Tabs.Item>
            </Tabs>
        </div>
    )
}

type OverviewProps = {
}

function Overview(props: OverviewProps) {
    return (
        <div>

        </div>
    )
}

type MonthlyProps = {

}

function Monthly(props: MonthlyProps) {
    let { t } = useTranslation("budget");
    let [budgets, setBudgets] = useState<TMonthly[]>([]);

    const fetchBudgets = () => {
        getMonthly().then((res) => {
            setBudgets(res.data);
        });
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    return (
        <div className="grid grid-cols-2 w-screen items-start justify-center">
            <div className="p-4">
                <DataTable
                    columns={[
                        { key: "position", label: t("position"), canEdit: true },
                        { key: "debit", label: t("debit"), canEdit: true },
                        { key: "credit", label: t("credit"), canEdit: true }
                    ]}
                    data={budgets}
                    onDelete={(row_index) => {
                        let rows = row_index.map((index) => budgets[index])

                        console.log("Deleting from ", budgets, row_index);
                        // Update state
                        let newBudgets = [...budgets];

                        newBudgets = newBudgets.filter((_, row) => !row_index.includes(row));
                        setBudgets(newBudgets);

                        deleteMonthly(rows.map((row) => row.id.toString()));
                    }}
                    onEdit={(row_index, key, value) => {
                        console.log("Edit", row_index, key, value);

                        let row = budgets[row_index];

                        // Update state
                        let newBudgets = [...budgets];
                        newBudgets[row_index] = {
                            ...row,
                            [key]: value
                        };
                        setBudgets(newBudgets);

                        updateMonthly({
                            id: row.id.toString(),
                            [key]: value
                        })
                    }} />
            </div>
            <div className="flex justify-center p-4 w-full m-0">
                <AddMonthly onSubmit={fetchBudgets} />
            </div>
        </div>
    )
}

type AddMonthlyForm = {
    position: string;
    debit: number;
    credit: number;
}

type AddMonthlyProps = {
    onSubmit?: () => void;
}

function AddMonthly(props: AddMonthlyProps) {
    const { t } = useTranslation("budget");

    const form: FormInputType[] = [
        {
            key: "position",
            type: InputType.TEXT,
            label: t("position"),
            placeholder: t("position_preview")
        },
        {
            key: "debit",
            type: InputType.NUMBER,
            label: t("debit")
        },
        {
            key: "credit",
            type: InputType.NUMBER,
            label: t("credit")
        }
    ];

    return (
        <Form value_type={form} onSubmit={(v: AddMonthlyForm) => {
            console.log("Submit", v);
            addMonthly({
                position: v.position,
                debit: v.debit,
                credit: v.credit
            }).then(() => {
                console.log("Added");
                props.onSubmit?.();
            })
        }} />
    )
}