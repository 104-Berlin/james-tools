import { Button, Modal, Tabs } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { addMonthly, Monthly as TMonthly, getMonthly, updateMonthly, deleteMonthly } from "../api/Budget";
import { KeyboardEvent, useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import EditField from "../components/EditField";


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

function Overview(_: OverviewProps) {
    return (
        <div>

        </div>
    )
}

type MonthlyProps = {

}

function Monthly(_: MonthlyProps) {
    const { t } = useTranslation("budget");
    const [budgets, setBudgets] = useState<TMonthly[]>([]);
    const [addModalOpen, setAddModalOpen] = useState(false);


    const fetchBudgets = () => {
        getMonthly().then((res) => {
            setBudgets(res.data);
        });
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    return (
        <div className="w-screen items-start justify-center py-4 px-32">
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

                        let quickLookup = new Set(row_index);

                        newBudgets = newBudgets.filter((_, row) => !quickLookup.has(row));
                        setBudgets(newBudgets);

                        deleteMonthly(rows.map((row) => row.id.toString()));
                    }}
                    onAdd={() => { setAddModalOpen(true) }}
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

            <AddMonthlyModal open={addModalOpen} onSubmit={() => {
                setAddModalOpen(false);
                fetchBudgets();
            }} />
        </div>
    )
}


type AddMonthlyProps = {
    open?: boolean;

    onSubmit?: () => void;
}

function AddMonthlyModal(props: AddMonthlyProps) {
    const { t } = useTranslation("budget");

    const [position, setPosition] = useState("");
    const [debit, setDebit] = useState(0);
    const [credit, setCredit] = useState(0);

    let clearInput = () => {
        setPosition("");
        setDebit(0);
        setCredit(0);
    }

    let submit = () => {
        addMonthly({
            position: position,
            debit: debit,
            credit: credit
        }).then(() => {
            props.onSubmit?.();
            clearInput();
        });

    };

    return (
        <Modal show={props.open} onClose={() => { clearInput(); props.onSubmit?.() }} onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => { if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); submit(); } }}>
            <Modal.Header>{t("add_monthly")}</Modal.Header>
            <Modal.Body>
                <EditField style="normal" autoFocus alwaysEdit label={t("position")} value={position} onChange={(v) => setPosition(v as string)} />
                <EditField style="normal" alwaysEdit label={t("debit")} value={debit} onChange={(v) => setDebit(v as number)} />
                <EditField style="normal" alwaysEdit label={t("credit")} value={credit} onChange={(v) => setCredit(v as number)} />
            </Modal.Body>
            <Modal.Footer>
                <Button color="success" onClick={submit}>{t("add_monthly")}</Button>
            </Modal.Footer>
        </Modal>
    )
}