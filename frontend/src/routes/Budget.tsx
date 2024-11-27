import { Button, Modal, Tabs } from "flowbite-react";
import { useTranslation } from "react-i18next";
import { addMonthly, Monthly as TMonthly, getMonthly, updateMonthly, deleteMonthly } from "../api/Budget";
import { KeyboardEvent, useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import EditField from "../components/EditField";
import { BarChart } from "../components/Charts";


export default function Budget() {
    let { t } = useTranslation("budget");
    let [monthly, setMonthly] = useState<TMonthly[]>([]);

    const fetchMonthly = () => {
        getMonthly().then((res) => {
            setMonthly(res.data);
        });
    };

    useEffect(() => {
        fetchMonthly();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center p-4">
            <h1 className="font-extrabold text-3xl p-8">Budget</h1>
            <Tabs variant="pills" className="w-full items-center justify-center">
                <Tabs.Item title={t("overview")}>
                    <Overview monthly={monthly} />
                </Tabs.Item>
                <Tabs.Item title={t("monthly")}>
                    <Monthly monthly={monthly} fetchMonthly={fetchMonthly} setMonthly={setMonthly} />
                </Tabs.Item>
            </Tabs>
        </div>
    )
}

type OverviewProps = {
    monthly: TMonthly[];
}

function Overview(props: OverviewProps) {
    const { t } = useTranslation("budget");

    let data = props.monthly.reduce((acc, row) => {
        return [acc[0] + row.debit, acc[1] + row.credit];
    }, [0, 0]);


    let series: ApexAxisChartSeries = [{
        name: "Saldo",
        data: [{
            x: t("debit"), y: data[0], fillColor: "#FF5733"
        }, { x: t("credit"), y: data[1], fillColor: "#33FF57" }],
        group: "Overview"
    }];

    return (
        <div>
            <BarChart data={series} />
        </div >
    )
}

type MonthlyProps = {
    monthly: TMonthly[];
    setMonthly: (monthly: TMonthly[]) => void;
    fetchMonthly: () => void;
}

function Monthly(props: MonthlyProps) {
    const { t } = useTranslation("budget");
    const [addModalOpen, setAddModalOpen] = useState(false);


    return (
        <div className="w-screen items-start justify-center py-4 px-32">
            <div className="p-4">
                <DataTable
                    columns={[
                        { key: "position", label: t("position"), canEdit: true },
                        { key: "debit", label: t("debit"), canEdit: true },
                        { key: "credit", label: t("credit"), canEdit: true }
                    ]}
                    data={props.monthly}
                    footer={props.monthly.reduce((acc, row) => {
                        return { ...acc, position: acc.position + row.credit - row.debit, credit: acc.credit + row.credit, debit: acc.debit + row.debit }
                    }, { credit: 0, debit: 0, id: "footer_row", position: 0 })
                    }
                    onDelete={(row_index) => {
                        let rows = row_index.map((index) => props.monthly[index])

                        // Update state
                        let newBudgets = [...props.monthly];

                        let quickLookup = new Set(row_index);

                        newBudgets = newBudgets.filter((_, row) => !quickLookup.has(row));
                        props.setMonthly(newBudgets);

                        deleteMonthly(rows.map((row) => row.id.toString()));
                    }}
                    onAdd={() => { setAddModalOpen(true) }}
                    onEdit={(row_index, key, value) => {
                        console.log("Edit", row_index, key, value);

                        let row = props.monthly[row_index];

                        // Update state
                        let newBudgets = [...props.monthly];
                        newBudgets[row_index] = {
                            ...row,
                            [key]: value
                        };
                        props.setMonthly(newBudgets);

                        updateMonthly({
                            id: row.id.toString(),
                            [key]: value
                        })
                    }} />
            </div>

            <AddMonthlyModal open={addModalOpen} onSubmit={() => {
                setAddModalOpen(false);
                props.fetchMonthly();
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