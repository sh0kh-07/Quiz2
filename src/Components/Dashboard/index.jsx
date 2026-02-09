import { useState, useEffect } from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { Users, FileQuestion } from "lucide-react";
import Loading from "../UI/Loadings/Loading";
import { Statistik } from "../../utils/Controllers/Statistik";

// recharts
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
} from "recharts";

const MONTHS = [
    "Yan", "Fev", "Mar", "Apr", "May", "Iyun",
    "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek",
];

const FULL_MONTHS = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr",
];

const formatYear = (year) => `${year} yil`;

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [year, setYear] = useState(new Date().getFullYear());
    const [data, setData] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    // Проверяем размер экрана
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const getStats = async (selectedYear) => {
        try {
            setLoading(true);
            const res = await Statistik.Get(selectedYear);
            setData(res.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStats(year);
    }, [year]);

    if (loading) return <Loading />;

    // Данные для BarChart с сокращенными месяцами на мобильных
    const chartData =
        data?.yearlyStats?.monthlyUserData.map((item, index) => ({
            month: isMobile ? MONTHS[item.month - 1] : FULL_MONTHS[item.month - 1],
            fullMonth: FULL_MONTHS[item.month - 1],
            monthNumber: item.month,
            users: item.userCount,
            quizzes: data.yearlyStats.monthlyQuizData[index].quizCount,
        })) || [];

    // Кастомный тултип
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-sm text-gray-800 mb-1">
                        {FULL_MONTHS[MONTHS.indexOf(label)] || label}
                    </p>
                    <p className="text-sm text-blue-600">
                        Foydalanuvchilar: <span className="font-bold">{payload[0].value}</span>
                    </p>
                    <p className="text-sm text-green-600">
                        Testlar: <span className="font-bold">{payload[1].value}</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    // Простая легенда для мобильных (без props)
    const MobileLegend = () => {
        return (
            <div className="flex justify-center gap-4 mt-2 mb-2">
                <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                    <span>Foydalanuvchilar</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 rounded-full bg-green-600" />
                    <span>Testlar</span>
                </div>
            </div>
        );
    };

    return (
        <div className="p-2 md:p-4 space-y-4 md:space-y-6">

            {/* Header - компактный на мобильных */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <Typography variant="h4" className="font-bold text-gray-800 text-lg md:text-xl">
                        Dashboard — {formatYear(year)}
                    </Typography>
                    <Typography className="text-xs md:text-sm text-gray-600">
                        Statistika va maʼlumotlar
                    </Typography>
                </div>

                {/* Year select - компактный */}
                <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="border rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                >
                    {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                        <option key={y} value={y}>
                            {formatYear(y)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Total stats - адаптивная сетка */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                <Card className="shadow-sm">
                    <CardBody className="flex items-center justify-between p-4 md:p-6">
                        <div>
                            <Typography className="text-xs md:text-sm text-gray-500">
                                Umumiy foydalanuvchilar
                            </Typography>
                            <Typography variant="h3" className="font-bold text-xl md:text-2xl lg:text-3xl">
                                {data?.totalStats?.userCount}
                            </Typography>
                        </div>
                        <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                    </CardBody>
                </Card>

                <Card className="shadow-sm">
                    <CardBody className="flex items-center justify-between p-4 md:p-6">
                        <div>
                            <Typography className="text-xs md:text-sm text-gray-500">
                                Umumiy testlar
                            </Typography>
                            <Typography variant="h3" className="font-bold text-xl md:text-2xl lg:text-3xl">
                                {data?.totalStats?.quizCount}
                            </Typography>
                        </div>
                        <FileQuestion className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
                    </CardBody>
                </Card>

                {data?.quizDataByType?.slice(0, isMobile ? 1 : 3).map((item, index) => (
                    <Card key={index} className="shadow-sm">
                        <CardBody className="flex items-center justify-between p-4 md:p-6">
                            <div>
                                <Typography className="text-xs md:text-sm text-gray-500">
                                    {item.type}
                                </Typography>
                                <Typography variant="h3" className="font-bold text-xl md:text-2xl lg:text-3xl">
                                    {item.count}
                                </Typography>
                            </div>
                            <FileQuestion className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Кнопка для показа всех типов на мобильных */}
            {isMobile && data?.quizDataByType?.length > 1 && (
                <div className="flex flex-wrap gap-2">
                    {data.quizDataByType.slice(1).map((item, index) => (
                        <div key={index} className="bg-gray-100 px-3 py-2 rounded-lg">
                            <Typography className="text-xs text-gray-600">{item.type}</Typography>
                            <Typography className="font-bold text-sm">{item.count}</Typography>
                        </div>
                    ))}
                </div>
            )}

            {/* Bar chart - адаптивный */}
            <Card className="shadow-sm">
                <CardBody className="p-3 md:p-6">
                    <Typography variant="h6" className="mb-3 md:mb-4 text-base md:text-lg">
                        Oylar bo‘yicha statistika — {formatYear(year)}
                    </Typography>

                    {/* Мобильная легенда */}
                    {isMobile && <MobileLegend />}

                    <div className="w-full h-[280px] sm:h-[320px] md:h-[340px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: isMobile ? 10 : 30,
                                    left: isMobile ? -20 : 0,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="2 2"
                                    vertical={false}
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: isMobile ? 10 : 12 }}
                                    angle={isMobile ? -45 : 0}
                                    textAnchor={isMobile ? "end" : "middle"}
                                    interval={isMobile ? 0 : "preserveStart"}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: isMobile ? 10 : 12 }}
                                    width={isMobile ? 30 : 40}
                                />
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                                />

                                {!isMobile && (
                                    <Legend
                                        wrapperStyle={{ paddingTop: 10 }}
                                        verticalAlign="top"
                                    />
                                )}

                                <Bar
                                    dataKey="users"
                                    name="Foydalanuvchilar"
                                    fill="#2563eb"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={isMobile ? 20 : 40}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#2563eb" />
                                    ))}
                                </Bar>

                                <Bar
                                    dataKey="quizzes"
                                    name="Testlar"
                                    fill="#16a34a"
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={isMobile ? 20 : 40}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#16a34a" />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Мобильная подсказка */}
                    {isMobile && (
                        <div className="mt-3 text-center">
                            <Typography className="text-xs text-gray-500">
                                Grafikni yonma-yon siljitish mumkin
                            </Typography>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Горизонтальный бар-чарт для мобильных (альтернативный вариант) */}
            {isMobile && (
                <Card className="shadow-sm md:hidden">
                    <CardBody className="p-3">
                        <Typography variant="h6" className="mb-3 text-base">
                            Eng ko'p testlar — {formatYear(year)}
                        </Typography>

                        <div className="space-y-3">
                            {chartData
                                .sort((a, b) => b.quizzes - a.quizzes)
                                .slice(0, 5)
                                .map((item, index) => (
                                    <div key={index} className="space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-medium">{item.fullMonth}</span>
                                            <span className="text-gray-600">{item.quizzes} test</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{
                                                    width: `${(item.quizzes / Math.max(...chartData.map(d => d.quizzes))) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
}