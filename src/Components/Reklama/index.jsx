import { useEffect, useState } from "react";
import { Notification } from "../../utils/Controllers/Notification";
import Create from "./__components/Create";
import {
    Card,
    Typography,
    Button,
} from "@material-tailwind/react";
import {
    Image as ImageIcon,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Bell,
} from "lucide-react";
import { format } from "date-fns";
import Delete from "./__components/Delete";
import Edit from "./__components/Edit";
import CONFIG from "../../utils/Config";
import SendReklam from "./__components/SendReklam";

export default function Reklama() {
    const [data, setData] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
    });
    const [loading, setLoading] = useState(false);


    const GetAllReklam = async (page = 1) => {
        try {
            setLoading(true);
            const response = await Notification?.GetAll(page);

            if (response?.data?.data) {
                setData(response.data.data.records || []);
                setPagination(response.data.data.pagination);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetAllReklam(1);
    }, []);

    const handlePageChange = (page) => {
        GetAllReklam(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const formatDate = (date) => {
        try {
            return format(new Date(date), "dd.MM.yyyy HH:mm");
        } catch {
            return date;
        }
    };

    return (
        <div className="pb-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <Typography variant="h5" className="font-bold">
                        Reklama
                    </Typography>
                    <Typography variant="small" color="gray">
                        Jami: {pagination.totalCount}
                    </Typography>
                </div>
                <Create refresh={() => GetAllReklam(pagination.currentPage)} />
            </div>

            {/* Cards */}
<div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    [...Array(5)].map((_, i) => (
                        <Card key={i} className="p-4 animate-pulse">
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-32 bg-gray-200 rounded w-full"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        </Card>
                    ))
                ) : data.length > 0 ? (
                    data.map((item) => (
                        <Card
                            key={item.id}
                            className="p-4 shadow-sm hover:shadow-md transition"
                        >
                            {/* Title */}
                            <div className="flex items-center gap-2 mb-2">
                                <Bell className="w-5 h-5 text-blue-600" />
                                <Typography className="font-semibold text-gray-900 text-sm sm:text-base">
                                    {item.title}
                                </Typography>
                            </div>

                            {/* Note */}
                            <Typography
                                variant="small"
                                className="text-gray-600 mb-3 text-xs sm:text-sm"
                            >
                                {item.note || "Matn mavjud emas"}
                            </Typography>

                            {/* Image */}
                            {item.image && (
                                <div className="mb-3">
                                    <img
                                        src={`${CONFIG?.API_URL}/${item.image}`}
                                        alt="notification"
                                        className="w-full max-h-52 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                            {/* Date */}
                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(item.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-[5px] mt-[15px]">
                                <Delete id={item?.id} refresh={() => GetAllReklam(pagination.currentPage)} />
                                <Edit data={item} refresh={() => GetAllReklam(pagination.currentPage)} />
                                <SendReklam data={item?.id} />
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="p-6 text-center">
                        <ImageIcon className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                        <Typography color="gray">
                            Reklama topilmadi
                        </Typography>
                    </Card>
                )}
            </div>

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                    <Button
                        variant="outlined"
                        size="sm"
                        onClick={() =>
                            handlePageChange(pagination.currentPage - 1)
                        }
                        disabled={pagination.currentPage <= 1}
                        className="flex items-center gap-1"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="text-xs">Oldingi</span>
                    </Button>

                    <Typography variant="small" color="gray">
                        {pagination.currentPage} / {pagination.totalPages}
                    </Typography>

                    <Button
                        variant="outlined"
                        size="sm"
                        onClick={() =>
                            handlePageChange(pagination.currentPage + 1)
                        }
                        disabled={
                            pagination.currentPage >= pagination.totalPages
                        }
                        className="flex items-center gap-1"
                    >
                        <span className="text-xs">Keyingi</span>
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}