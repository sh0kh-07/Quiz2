import { useEffect, useState } from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { Calendar, Clock, Eye, FileText } from "lucide-react";
import { QuizApi } from "../../utils/Controllers/QuizApi";
import EmptyData from "../UI/NoData/EmptyData";
import Loading from "../UI/Loadings/Loading";
import Create from "./__components/Create";
import Delete from "./__components/Delete";
import Edit from "./__components/Edit";
import { NavLink } from "react-router-dom";

export default function QuizList() {
    const [quizzes, setQuizzes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchQuizzes = async (page = 1) => {
        try {
            setLoading(true);
            const res = await QuizApi.Get(page);
            setQuizzes(res?.data?.data?.records);
            setCurrentPage(Number(res.data.pagination.currentPage));
            setTotalPages(Number(res.data.pagination.totalPages));
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes(1);
    }, []);

    const handlePageChange = (page) => {
        fetchQuizzes(page);
    };

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="">
            <div className="flex items-center justify-between">
                <Typography variant="h4" className="mb-6 text-gray-800">
                    Quizlar ro‘yxati
                </Typography>
                <Create refresh={fetchQuizzes} />
            </div>

            {/* Список карточек */}
            {quizzes.length === 0 ? (
                <EmptyData text={`Ma'lumot yo'q`} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quizzes.map((quiz) => (
                        <Card
                            key={quiz.id}
                            className="shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition"
                        >
                            <CardBody className="flex flex-col gap-3">
                                <Typography variant="h6" className="font-medium text-gray-800 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-500" />
                                    {quiz.name}
                                </Typography>

                                <div className="flex justify-between items-center text-gray-600 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{quiz.time} daqiqa</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{quiz.count} savol</span>
                                    </div>
                                </div>

                                <Typography className="text-gray-500 text-xs mt-2">
                                    Yaratilgan: {new Date(quiz.createdAt).toLocaleDateString("uz-UZ")}
                                </Typography>

                                <div className="flex items-center gap-[10px]">
                                    <NavLink to={`/quiz/${quiz?.id}`}>
                                        <Button
                                            size="sm"
                                            className=" bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1"
                                        >
                                            <Eye className="w-4 h-4" />  Ko‘rish
                                        </Button>
                                    </NavLink>
                                    <Delete refresh={fetchQuizzes} id={quiz?.id} />
                                    <Edit refresh={fetchQuizzes} data={quiz} />
                                </div>


                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {/* Пагинация */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                            key={i + 1}
                            size="sm"
                            variant={currentPage === i + 1 ? "filled" : "outlined"}
                            color={currentPage === i + 1 ? "blue" : "gray"}
                            onClick={() => handlePageChange(i + 1)}
                        >
                            {i + 1}
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
}
