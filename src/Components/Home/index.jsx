import { useState, useEffect } from "react";
import { QuizApi } from "../../utils/Controllers/QuizApi";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { ChevronLeft, ChevronRight, FileText, Clock, Calendar, Search } from "lucide-react";
import Loading from "../UI/Loadings/Loading";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Компонент для пустого состояния
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
            <div className="bg-gray-50 rounded-full p-6 mb-4">
                <Search className="w-16 h-16 text-gray-300" />
            </div>
            <Typography variant="h5" className="text-gray-700 mb-2 font-medium">
                Quizlar topilmadi
            </Typography>
            <Typography className="text-gray-500 text-center max-w-md">
                Hozircha hech qanday quiz mavjud emas. Keyinroq qaytib ko'ring.
            </Typography>
        </div>
    );
}

export default function Home() {
    const navigate = useNavigate();
    const [chatId, setChatId] = useState(null);
    const [quizzes, setQuizzes] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    // Получаем chatId
    useEffect(() => {
        try {
            const WebApp = window.Telegram?.WebApp;
            WebApp?.ready();
            const data = WebApp?.initDataUnsafe;
            const id = data?.chat?.id ?? data?.user?.id ?? null;
            setChatId(id);
            if (id) localStorage.setItem("telegramChatId", id);
        } catch (error) {
            console.error("Ошибка инициализации Telegram WebApp:", error);
        }
    }, []);

    // Получаем квизы с сервера
    const getQuiz = async (pageNum = 1) => {
        setLoading(true);
        try {
            const response = await QuizApi.Get(pageNum);
            setQuizzes(response?.data?.data?.records || []);
            setTotalPages(response?.data?.data?.pagination?.totalPages || 1);
            setPage(Number(response?.data?.data?.pagination?.currentPage) || 1);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getQuiz(page);
    }, [page]);

    const handlePrev = () => {
        if (page > 1) setPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(prev => prev + 1);
    };

    const handleQuizClick = (quiz) => {
        Swal.fire({
            title: "Testni boshlaysizmi?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Ha",
            cancelButtonText: "Yo'q",
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#6b7280",
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(`/test/${quiz?.id}`);
            }
        });
    };

    if (loading) return <Loading />;

    if (quizzes.length === 0) return <EmptyState />;

    return (
        <div className="min-h-screen p-4 bg-gray-100">
            <Typography variant="h4" className="text-center mb-6 font-semibold">
                Quizlar
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizzes.map(quiz => (
                    <Card
                        key={quiz.id}
                        className="shadow-md hover:shadow-xl transition duration-200 cursor-pointer"
                        onClick={() => handleQuizClick(quiz)}
                    >
                        <CardBody className="flex flex-col gap-3">
                            <Typography variant="h6" className="font-bold text-gray-800">
                                {quiz.name}
                            </Typography>
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                <FileText className="w-4 h-4" />
                                Savollar: <span className="font-medium">{quiz.count}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600 text-sm">
                                <Clock className="w-4 h-4" />
                                Vaqt: <span className="font-medium">{quiz.time} daqiqa</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 text-xs">
                                <Calendar className="w-4 h-4" />
                                Yaratilgan: {new Date(quiz.createdAt).toLocaleDateString()}
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <Button
                        variant="outlined"
                        size="sm"
                        color="blue-gray"
                        onClick={handlePrev}
                        disabled={page === 1}
                        className="flex items-center gap-1"
                    >
                        <ChevronLeft className="w-4 h-4" /> Oldingi
                    </Button>
                    <Typography className="text-gray-700 font-medium">
                        {page} / {totalPages}
                    </Typography>
                    <Button
                        variant="outlined"
                        size="sm"
                        color="blue-gray"
                        onClick={handleNext}
                        disabled={page === totalPages}
                        className="flex items-center gap-1"
                    >
                        Keyingi <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
}