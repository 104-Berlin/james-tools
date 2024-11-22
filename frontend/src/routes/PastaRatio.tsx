import { useState } from "react";
import EditField from "../components/EditField";
import { Dropdown } from "flowbite-react";
import { useTranslation } from "react-i18next";

export default function PastaRatio() {
    const { t } = useTranslation("pasta_ratio");
    // 300 gr of flour to 185 gr of wet ingredients
    const ratio = 300 / 185;

    let [number_eggs, setNumberEggs] = useState(1);
    let [selectedEggSize, setSelectedEggSize] = useState<"sm" | "md" | "lg" | "xl">("sm");

    let getSelectedEggWeight = () => {
        switch (selectedEggSize) {
            case "sm":
                return 52;
            case "md":
                return 56;
            case "lg":
                return 62;
            case "xl":
                return 68;
        }
    }

    return (
        <div className="flex justify-center">
            <div className="flex flex-col space-y-4 p-4 outline outline-1 rounded-md">
                <div className="max-w-md">
                    <EditField style="normal" value={number_eggs} alwaysEdit onChange={(e) => setNumberEggs(e as number)} />
                </div>
                <div className="shrink-1 w-fit">{Math.round((number_eggs * getSelectedEggWeight()) * ratio)} gr Flour</div>
                <Dropdown label={`Egg size (${t(selectedEggSize)})`}>
                    <Dropdown.Item onClick={() => setSelectedEggSize("sm")}>{t("sm")}</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedEggSize("md")}>{t("md")}</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedEggSize("lg")}>{t("lg")}</Dropdown.Item>
                    <Dropdown.Item onClick={() => setSelectedEggSize("xl")}>{t("xl")}</Dropdown.Item>
                </Dropdown>
            </div>
        </div>
    )
}