import { Button, Dropdown, Select } from "flowbite-react";
import { getEmptyRooms, Room, updateRooms } from "../api/Htw";
import { useState } from "react";

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
    let [weekday, setWeekday] = useState(0);
    let [startTime, setStartTime] = useState("08:00");
    let [endTime, setEndTime] = useState("09:00");
    let [emptyRooms, setEmptyRooms] = useState<Room[]>([]);


    return (
        <div className="p-4">
            <Button onClick={() => { updateRooms() }}>Update Rooms</Button>
            <Dropdown label={WeekdayToString(weekday)}>
                <Dropdown.Item onClick={() => { setWeekday(0) }}>Monday</Dropdown.Item>
                <Dropdown.Item onClick={() => { setWeekday(1) }}>Tuesday</Dropdown.Item>
                <Dropdown.Item onClick={() => { setWeekday(2) }}>Wednesday</Dropdown.Item>
                <Dropdown.Item onClick={() => { setWeekday(3) }}>Thursday</Dropdown.Item>
                <Dropdown.Item onClick={() => { setWeekday(4) }}>Friday</Dropdown.Item>
                <Dropdown.Item onClick={() => { setWeekday(5) }}>Saturday</Dropdown.Item>
                <Dropdown.Item onClick={() => { setWeekday(6) }}>Sunday</Dropdown.Item>
            </Dropdown>
            <Dropdown label={startTime}>
                {possibleTimes.map((time) => {
                    return <Dropdown.Item onClick={() => { setStartTime(time) }}>{time}</Dropdown.Item>
                })}
            </Dropdown>
            <Dropdown label={endTime}>
                {possibleTimes.filter((time) => {
                    return possibleTimes.indexOf(time) > possibleTimes.indexOf(startTime);
                }).map((time) => {
                    return <Dropdown.Item onClick={() => { setEndTime(time) }}>{time}</Dropdown.Item>
                })}
            </Dropdown>

            <Button onClick={() => { getEmptyRooms(weekday, startTime, endTime).then((e) => setEmptyRooms(e.data)) }}>
                Find Empty Rooms
            </Button>
            <div>
                {emptyRooms.map((room) => {
                    return <div>{room.name}</div>
                })}
            </div>
        </div>
    )
}