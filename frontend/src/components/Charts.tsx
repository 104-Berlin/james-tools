import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";


export type PieChartProps = {
    data: number[];
}

export function PieChart({ data }: PieChartProps) {
    let options: ApexOptions = {
        labels: ["Debit", "Credit"],
        legend: {
            show: false,
            position: "bottom"
        },
        dataLabels: {
            enabled: true,
        }
    };

    return (
        <Chart type="pie" options={options} series={data} />
    )
}

export type BarChartProps = {
    data: ApexAxisChartSeries | ApexNonAxisChartSeries;
}

export function BarChart({ data }: BarChartProps) {
    let options: ApexOptions = {
        chart: {
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,

            }
        },
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 5,
                colors: {
                    ranges: [
                        {
                            from: 0,
                            to: 0,
                            color: '#FF5733' // Rot für Debit
                        },
                        {
                            from: 1,
                            to: 1,
                            color: '#33FF57' // Grün für Credit
                        }
                    ]
                }
            }
        },
        xaxis: {
            categories: ["Debit", "Credit"],

        },
        fill: {
            opacity: 1
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => {
                return val + " €"
            }
        },
        tooltip: {
            y: {
                formatter: (val) => {
                    return val + " €"
                }
            }
        },
        colors: ['#FF5733', '#33FF57']
    }

    return (
        <Chart type="bar" series={data} options={options} />
    )
}