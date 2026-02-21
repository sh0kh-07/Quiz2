import { useState, useEffect } from "react";
import { Card, CardBody, Typography, Button, IconButton } from "@material-tailwind/react";
import { ChevronLeft, ChevronRight, FileText, Clock, Calendar, Search, Lock, Unlock, BookOpen, CheckCircle, Grid, List, AlertTriangle, Clock as ClockIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { apiTopicModule } from "../../utils/Controllers/TopicModule";

export default function Home() {
    const navigate = useNavigate();
    const [chatId, setChatId] = useState(null);
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [errorDetails, setErrorDetails] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0
    });
    const LocalId = localStorage.getItem('telegramChatId');

    // chatId ni olish
    useEffect(() => {
        try {
            const WebApp = window.Telegram?.WebApp;
            WebApp?.ready();
            const data = WebApp?.initDataUnsafe;
            const id = data?.chat?.id ?? data?.user?.id ?? null;
            setChatId(id);
            if (id) localStorage.setItem("telegramChatId", id);
        } catch (error) {
            console.error("Telegram WebApp ni ishga tushirishda xatolik:", error);
        }
    }, []);

    const GetModule = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            setErrorDetails(null);

            const userId = chatId || LocalId;
            const response = await apiTopicModule?.GetForUser({ page, telegramUserId: userId });

            if (response?.status === 200 && response?.data) {
                setModules(response.data.data?.records || []);
                setPagination({
                    currentPage: response?.data.data.pagination?.currentPage || 1,
                    totalPages: response?.data.data.pagination?.totalPages || 1,
                    totalCount: response?.data.data.pagination?.totalCount || 0
                });
            }
        } catch (error) {
            console.error("Modullarni yuklashda xatolik:", error);

            // Xatolik ma'lumotlarini olish
            const errorResponse = error?.response?.data || error;

            // 403 xatolikni tekshirish
            if (errorResponse?.statusCode === 403 || errorResponse?.error === 'Forbidden') {
                setError('forbidden');
                setErrorDetails({
                    message: errorResponse?.message || 'Ruxsat berilmagan',
                    time: extractTimeFromMessage(errorResponse?.message)
                });
            } else {
                setError('general');
                Swal.fire({
                    icon: 'error',
                    title: 'Xatolik',
                    text: 'Modullarni yuklab bo‘lmadi',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Vaqtni message dan ajratib olish
    const extractTimeFromMessage = (message) => {
        if (!message) return null;
        const timeMatch = message.match(/(\d{2}:\d{2})–(\d{2}:\d{2})/);
        if (timeMatch) {
            return {
                start: timeMatch[1],
                end: timeMatch[2]
            };
        }
        return null;
    };

    useEffect(() => {
        if (chatId || LocalId) {
            GetModule(1);
        }
    }, [chatId]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            GetModule(newPage);
        }
    };

    const handleModuleClick = (module) => {
        if (module.status === 'locked') {
            Swal.fire({
                icon: 'info',
                title: 'Modul bloklangan',
                text: 'Avval oldingi modullarni tugatishingiz kerak',
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }
        // Modulga o'tish
        navigate(`/module/${module.id}`);
    };

    // Modul statusi ikonka bilan
    const getModuleStatus = (status) => {
        switch (status) {
            case 'locked':
                return { icon: <Lock size={18} className="text-red-500" />, text: 'Bloklangan', color: 'text-red-500' };
            case 'completed':
                return { icon: <CheckCircle size={18} className="text-green-500" />, text: 'Tugallangan', color: 'text-green-500' };
            default:
                return { icon: <Unlock size={18} className="text-blue-500" />, text: 'Mavjud', color: 'text-blue-500' };
        }
    };

    // Modul progressi
    const getProgress = (module) => {
        if (!module.totalTopics) return 0;
        return Math.round((module.completedTopics / module.totalTopics) * 100);
    };

    // Forbidden xatolik uchun komponent
    const ForbiddenError = () => (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardBody className="text-center py-8 px-6">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle size={40} className="text-red-600" />
                        </div>
                    </div>

                    <Typography variant="h4" className="font-bold text-gray-800 mb-3">
                        Kirish cheklangan
                    </Typography>

                    <Typography className="text-gray-600 mb-4">
                        {errorDetails?.message || "Basic 200 tarifi faqat 14:00 dan 22:00 gacha ishlaydi"}
                    </Typography>

                    {errorDetails?.time && (
                        <div className="bg-blue-50 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-center gap-2 text-blue-700 mb-2">
                                <ClockIcon size={20} />
                                <Typography variant="h5" className="font-bold">
                                    {errorDetails.time.start} - {errorDetails.time.end}
                                </Typography>
                            </div>
                            <Typography className="text-sm text-blue-600">
                                Iltimos, belgilangan vaqtda qayta urinib ko'ring
                            </Typography>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Button
                            color="blue"
                            className="w-full"
                            onClick={() => GetModule(1)}
                        >
                            Qayta urinish
                        </Button>
                    </div>

                    <Typography className="text-xs text-gray-400 mt-6">
                        Agar muammo takrorlansa, administrator bilan bog'lanishingiz mumkin
                    </Typography>
                </CardBody>
            </Card>
        </div>
    );

    // Agar 403 xatolik bo'lsa, maxsus sahifani ko'rsatish
    if (error === 'forbidden') {
        return <ForbiddenError />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="px-4 py-4">
                    <div className="flex justify-between items-center mb-2">
                        <Typography variant="h4" className="font-bold text-gray-800">
                            📚 Modullar 
                        </Typography>
                    </div>
                    {/* Statistika */}
                    <div className="flex gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <BookOpen size={16} />
                            <span>{pagination.totalCount} ta modul</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <CheckCircle size={16} className="text-green-500" />
                            <span>{modules.filter(m => m.status === 'completed').length} ta tugallangan</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Asosiy qism */}
            <div className="p-4">
                {loading ? (
                    [...Array(5)].map((_, i) => (
                        <Card key={i} className="p-4 mb-[10px] animate-pulse">
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <>
                        {/* Modullar ro'yxati */}
                        {modules.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {modules.map((module, index) => {
                                    const status = getModuleStatus(module.status);
                                    const progress = getProgress(module);
                                    return (
                                        <Card
                                            key={module.id}
                                            className={`cursor-pointer transition-all hover:shadow-lg ${module.status === 'locked' ? 'opacity-75' : 'hover:scale-102'
                                                }`}
                                            onClick={() => handleModuleClick(module)}
                                        >
                                            <CardBody className="p-4">
                                                {/* Yuqori qism - raqam va status */}
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <span className="font-bold text-blue-600">{module.index || index + 1}</span>
                                                        </div>
                                                        <Typography variant="h6" className="font-semibold">
                                                            {module.name}
                                                        </Typography>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {status.icon}
                                                        <span className={`text-xs ${status.color}`}>
                                                            {status.text}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Progress */}
                                                {module.totalTopics > 0 && (
                                                    <div className="mb-3">
                                                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                            <span>Progress</span>
                                                            <span>{module.completedTopics}/{module.totalTopics}</span>
                                                        </div>
                                                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Qo'shimcha ma'lumot */}
                                                <div className="flex gap-3 text-xs text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <BookOpen size={14} />
                                                        <span>{module.totalTopics || 0} ta mavzu</span>
                                                    </div>
                                                    {module.completedTopics > 0 && (
                                                        <div className="flex items-center gap-1">
                                                            <CheckCircle size={14} className="text-green-500" />
                                                            <span>{module.completedTopics} ta tugallangan</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Amal tugmasi */}
                                                {module.status !== 'locked' && (
                                                    <Button
                                                        size="sm"
                                                        color="blue"
                                                        className="mt-3 w-full"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleModuleClick(module);
                                                        }}
                                                    >
                                                        Boshlash
                                                    </Button>
                                                )}
                                            </CardBody>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            // Bo'sh holat
                            <Card className="w-full bg-white">
                                <CardBody className="text-center py-12">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BookOpen size={32} className="text-gray-400" />
                                    </div>
                                    <Typography variant="h5" className="text-gray-700 mb-2">
                                        Modullar mavjud emas
                                    </Typography>
                                    <Typography className="text-gray-500">
                                        Sahifani yangilab ko'ring yoki administratorga murojaat qiling
                                    </Typography>
                                    <Button
                                        color="blue"
                                        variant="outlined"
                                        className="mt-4"
                                        onClick={() => GetModule(1)}
                                    >
                                        Yangilash
                                    </Button>
                                </CardBody>
                            </Card>
                        )}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-6 flex justify-center items-center gap-2">
                                <IconButton
                                    size="sm"
                                    variant="outlined"
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={pagination.currentPage === 1}
                                    className="rounded-lg"
                                >
                                    <ChevronLeft size={18} />
                                </IconButton>

                                <div className="flex gap-1">
                                    {[...Array(pagination.totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        if (
                                            pageNum === 1 ||
                                            pageNum === pagination.totalPages ||
                                            (pageNum >= pagination.currentPage - 1 &&
                                                pageNum <= pagination.currentPage + 1)
                                        ) {
                                            return (
                                                <Button
                                                    key={pageNum}
                                                    size="sm"
                                                    variant={pagination.currentPage === pageNum ? "filled" : "text"}
                                                    color="blue"
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`min-w-[40px] rounded-lg ${pagination.currentPage === pageNum
                                                        ? 'shadow-md'
                                                        : 'hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        } else if (
                                            pageNum === pagination.currentPage - 2 ||
                                            pageNum === pagination.currentPage + 2
                                        ) {
                                            return <span key={pageNum} className="px-2">...</span>;
                                        }
                                        return null;
                                    })}
                                </div>

                                <IconButton
                                    size="sm"
                                    variant="outlined"
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={pagination.currentPage === pagination.totalPages}
                                    className="rounded-lg"
                                >
                                    <ChevronRight size={18} />
                                </IconButton>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}