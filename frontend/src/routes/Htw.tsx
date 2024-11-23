import { Button, Dropdown, HR, Select } from "flowbite-react";
import { getEmptyRooms, Room, updateRooms } from "../api/Htw";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "../components/DataTable";

function WeekdayToString(weekday: number) {
    switch (weekday) {
        case 0:
            return "Monday";
        case 1:
            return "Tuesday";
        case 2:
            return "Wednesday";
        case 3:
            return "Thursday";
        case 4:
            return "Friday";
        case 5:
            return "Saturday";
        case 6:
            return "Sunday";
        default:
            return "";
    }
}

// Every hour from 00:00 to 20:00 will be split into 15 minutes
function choosableTimes() {
    let times = [];
    for (let hour = 0; hour < 12; hour++) {
        for (let min = 0; min < 4; min++) {
            let hour_str = `${hour + 8}`.padStart(2, "0");
            let min_str = `${min * 15}`.padStart(2, "0");
            times.push(`${hour_str}:${min_str}`);
        }
    }
    return times;
}

const possibleTimes = choosableTimes();

export default function Htw() {
    const { t } = useTranslation("htw");
    let [weekday, setWeekday] = useState(0);
    let [startTime, setStartTime] = useState("08:00");
    let [endTime, setEndTime] = useState("09:00");
    let [emptyRooms, setEmptyRooms] = useState<Room[]>([]);


    return (
        <div className="flex flex-col justify-center">
            <h1 className="font-extrabold text-3xl p-8">
                {t("header")}
            </h1>
            <div className="flex flex-col space-y-4 p-4 max-w-full">
                <Button onClick={() => { updateRooms() }}>{t("update_rooms")}</Button>
                <HR />
                <div className="min-w-full max-w-full">
                    <label>
                        {t("weekday")}
                    </label>
                    <Dropdown theme={{ floating: { target: "w-full" } }} className="w-full" hidden label={WeekdayToString(weekday)}>
                        <Dropdown.Item onClick={() => { setWeekday(0) }}>{t("monday")}</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setWeekday(1) }}>{t("tuesday")}</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setWeekday(2) }}>{t("wednesday")}</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setWeekday(3) }}>{t("thursday")}</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setWeekday(4) }}>{t("friday")}</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setWeekday(5) }}>{t("saturday")}</Dropdown.Item>
                        <Dropdown.Item onClick={() => { setWeekday(6) }}>{t("sunday")}</Dropdown.Item>
                    </Dropdown>
                </div>
                <div className="flex space-x-4">
                    <div>
                        <label>
                            {t("from")}
                        </label>
                        <Dropdown className="max-h-96 overflow-auto" label={startTime}>
                            {possibleTimes.map((time) => {
                                return <Dropdown.Item onClick={() => { setStartTime(time) }}>{time}</Dropdown.Item>
                            })}
                        </Dropdown>
                    </div>
                    <div>
                        <label>
                            {t("to")}
                        </label>
                        <Dropdown className="max-h-96 overflow-auto" label={endTime}>
                            {possibleTimes.filter((time) => {
                                return possibleTimes.indexOf(time) > possibleTimes.indexOf(startTime);
                            }).map((time) => {
                                return <Dropdown.Item onClick={() => { setEndTime(time) }}>{time}</Dropdown.Item>
                            })}
                        </Dropdown>
                    </div>

                </div>
                <Button className="flex items-center" onClick={() => { getEmptyRooms(weekday, startTime, endTime).then((e) => setEmptyRooms(e.data)) }}>
                    {t("search")}
                </Button>
                <DataTable columns={[{ key: "name", label: "Name" }]} data={emptyRooms} />
            </div>
        </div>
    )
}