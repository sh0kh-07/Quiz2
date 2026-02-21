import { useEffect, useState } from "react";
import { QuestionApi } from "../../utils/Controllers/QuestionApi";
import { UserAnswer } from "../../utils/Controllers/UserAnswer";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Typography, Button, Progress } from "@material-tailwind/react";
import { CheckCircle, XCircle, AlertCircle, Image as ImageIcon } from "lucide-react";
import Swal from "sweetalert2";
import Loading from "../UI/Loadings/Loading";
import { Alert } from "../../utils/Alert";
import CONFIG from "../../utils/Config";

export default function Test() {
    const { id } = useParams();
    const navigate = useNavigate();

    // URL для изображений

    // ─── Test bosqichi ───
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [testFinished, setTestFinished] = useState(false);
    const [loading, setLoading] = useState(false);
    const [quizInfo, setQuizInfo] = useState(null);
    const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
    const [startTime, setStartTime] = useState(null);
    const [userQuizId, setUserQuizId] = useState(null);
    const [testStarted, setTestStarted] = useState(false);


    const userId = localStorage.getItem('telegramChatId')



    // ─── Savollarni olish ───
    const GetAllQuiz = async () => {
        try {
            setLoading(true);
            const response = await QuestionApi.GetForUser(id);
            const data = response?.data || [];
            setQuestions(data);

            if (data.length > 0) {
                setQuizInfo(data[0].quiz);
                setStartTime(Date.now());
                setUserQuizId(id);
                setTestStarted(true);
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Xatolik",
                text: "Testni yuklashda xatolik yuz berdi",
                confirmButtonText: "Orqaga",
            }).then(() => {
                navigate(-1);
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        GetAllQuiz();
    }, [id]);

    const handleAnswerSelect = (questionId, optionId) => {
        if (answeredQuestions.has(questionId)) return;

        setSelectedAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));

        setAnsweredQuestions((prev) => new Set([...prev, questionId]));
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    const PostAnswer = async () => {
        try {
            const answers = Object.entries(selectedAnswers).map(([questionId, optionId]) => ({
                userTopicId: userQuizId,
                questionId: questionId,
                optionId: optionId,
                note: "",
            }));

            const data = {
                chatId: userId,
                topicId: id,
                endTime: 1,
                pdfView: true,
                answers: answers,
            };

            const response = await UserAnswer.Create(data);
            Alert("Test muvaffaqiyatli yakunlandi", "success");
            return response;
        } catch (error) {
            Alert("Javoblarni yuborishda xatolik", "error");
            console.error("Javoblarni yuborishda xatolik:", error);
        }
    };

    const handleSubmit = async (autoSubmit = false) => {
        const answeredCount = Object.keys(selectedAnswers).length;

        if (!autoSubmit && answeredCount < questions.length) {
            Swal.fire({
                title: "Diqqat!",
                text: `Siz ${questions.length - answeredCount} ta savolga javob bermadingiz. Testni yakunlamoqchimisiz?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Ha, yakunlash",
                cancelButtonText: "Yo'q, davom etish",
                confirmButtonColor: "#ef4444",
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await PostAnswer();
                    setTestFinished(true);
                }
            });
        } else {
            await PostAnswer();
            setTestFinished(true);
        }
    };

    const calculateResults = () => {
        let correctCount = 0;

        questions.forEach((question) => {
            const selectedOptionId = selectedAnswers[question.id];
            const correctOption = question.options.find((opt) => opt.isCorrect);

            if (selectedOptionId === correctOption?.id) {
                correctCount++;
            }
        });

        return {
            correct: correctCount,
            incorrect: Object.keys(selectedAnswers).length - correctCount,
            unanswered: questions.length - Object.keys(selectedAnswers).length,
            percentage: ((correctCount / questions.length) * 100).toFixed(1),
        };
    };

    // ══════════════════════════════════════
    // LOADING
    // ══════════════════════════════════════
    if (loading) return <Loading />;

    // ══════════════════════════════════════
    // SAVOLLAR BO'SH
    // ══════════════════════════════════════
    if (!loading && questions.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 text-center">
                        <div className="flex justify-center mb-5">
                            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-8 h-8 text-orange-500" />
                            </div>
                        </div>

                        <Typography variant="h5" className="font-bold text-gray-800 mb-2">
                            Savollar topilmadi
                        </Typography>
                        <Typography className="text-gray-500 text-sm mb-6">
                            Hozircha bu test uchun savollar mavjud emas.
                        </Typography>

                        <Button
                            fullWidth
                            color="blue"
                            variant="outlined"
                            onClick={() => navigate(-1)}
                            className="normal-case"
                        >
                            Orqaga qaytish
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // ══════════════════════════════════════
    // NATIJALAR
    // ══════════════════════════════════════
    if (testFinished) {
        const results = calculateResults();

        return (
            <div className="min-h-screen bg-gray-50 p-3 sm:p-4">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4">
                        <Typography variant="h4" className="font-bold text-gray-800 text-center mb-2">
                            Test yakunlandi
                        </Typography>
                        {quizInfo?.name && (
                            <Typography className="text-gray-600 text-center text-sm sm:text-base">
                                {quizInfo.name}
                            </Typography>
                        )}
                    </div>

                    {/* Asosiy statistika */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">
                                {results.percentage}%
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">Natija</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">
                                {results.correct}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">To'g'ri</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-1">
                                {results.incorrect}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">Noto'g'ri</div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-4 text-center">
                            <div className="text-3xl sm:text-4xl font-bold text-gray-600 mb-1">
                                {results.unanswered}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">Javobsiz</div>
                        </div>
                    </div>

                    {/* Batafsil natijalar */}
                    <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4">
                        <Typography variant="h6" className="font-semibold text-gray-800 mb-4">
                            Batafsil natijalar
                        </Typography>

                        <div className="space-y-4">
                            {questions.map((question, index) => {
                                const selectedOptionId = selectedAnswers[question.id];
                                const correctOption = question.options.find((opt) => opt.isCorrect);
                                const isCorrect = selectedOptionId === correctOption?.id;
                                const isAnswered = selectedOptionId !== undefined;

                                return (
                                    <div
                                        key={question.id}
                                        className="border-l-4 pl-3 py-2"
                                        style={{
                                            borderColor: !isAnswered ? "#d1d5db" : isCorrect ? "#10b981" : "#ef4444",
                                        }}
                                    >
                                        <div className="flex items-start gap-2 mb-2">
                                            <div className="flex-shrink-0 mt-0.5">
                                                {!isAnswered ? (
                                                    <AlertCircle className="w-5 h-5 text-gray-400" />
                                                ) : isCorrect ? (
                                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-600" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <Typography className="font-medium text-gray-800 text-sm sm:text-base">
                                                    {index + 1}. {question.question}
                                                </Typography>

                                                {question.image && (
                                                    <div className="mt-2">
                                                        <img
                                                            src={`${CONFIG?.API_URL}${question.image}`}
                                                            alt={`Question ${index + 1}`}
                                                            className="max-w-full h-auto rounded-lg border border-gray-200 max-h-48 object-contain"
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="ml-7 space-y-2">
                                            {question.options.map((option) => {
                                                const isSelected = selectedOptionId === option.id;
                                                const isCorrectAnswer = option.isCorrect;

                                                return (
                                                    <div key={option.id} className="text-sm">
                                                        {isCorrectAnswer && (
                                                            <div className="flex items-start gap-2 p-2 bg-green-50 rounded border border-green-200">
                                                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                                                                <div className="flex-1">
                                                                    <div className="text-green-800 font-medium">{option.text}</div>
                                                                    {option.note && (
                                                                        <div className="text-green-700 text-xs mt-1 italic">
                                                                            💡 {option.note}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {isSelected && !isCorrectAnswer && (
                                                            <div className="flex items-start gap-2 p-2 bg-red-50 rounded border border-red-200">
                                                                <XCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                                                <div className="text-red-800">{option.text}</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tugmalar */}
                    <div className="flex gap-3">
                        <Button
                            fullWidth
                            color="blue"
                            variant="outlined"
                            onClick={() => navigate('/')}
                            className="normal-case"
                        >
                            Bosh sahifa
                        </Button>
                        <Button
                            fullWidth
                            color="blue"
                            onClick={() => navigate(-1)}
                            className="normal-case"
                        >
                            Tugatish
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // ══════════════════════════════════════
    // TEST JARAYONI
    // ══════════════════════════════════════
    const currentQ = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    const isQuestionAnswered = answeredQuestions.has(currentQ?.id);
    const selectedOptionId = selectedAnswers[currentQ?.id];

    return (
        <div className="min-h-screen bg-gray-50 p-3 sm:p-4 pb-20">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sticky top-0 z-10">
                    <div className="flex justify-between items-center mb-3">
                        <div className="truncate pr-2">
                            {quizInfo?.name && (
                                <Typography variant="h6" className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                                    {quizInfo.name}
                                </Typography>
                            )}
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-blue-100 text-blue-700">
                            <span className="font-medium text-sm sm:text-base">
                                Savol {currentQuestion + 1} / {questions.length}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                            <span>Progress</span>
                            <span>{Object.keys(selectedAnswers).length} / {questions.length} javob</span>
                        </div>
                        <Progress value={progress} color="blue" className="h-2" />
                    </div>
                </div>

                {/* Savol */}
                <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4">
                    {currentQ?.question && (
                        <Typography variant="h6" className="mb-3 text-gray-800 font-medium text-base sm:text-lg">
                            {currentQ.question}
                        </Typography>
                    )}

                    {currentQ?.image && (
                        <div className="mb-4">
                            <img
                                src={`${CONFIG?.API_URL}${currentQ.image}`}
                                alt="Question"
                                className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm max-h-64 object-contain mx-auto"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextSibling) {
                                        e.target.nextSibling.style.display = 'flex';
                                    }
                                }}
                            />
                            <div className="hidden items-center justify-center gap-2 p-4 bg-gray-100 rounded-lg text-gray-500 text-sm">
                                <ImageIcon className="w-5 h-5" />
                                <span>Rasmni yuklab bo'lmadi</span>
                            </div>
                        </div>
                    )}

                    {/* Variantlar */}
                    <div className="space-y-2 sm:space-y-3">
                        {currentQ?.options.map((option, index) => {
                            const isSelected = selectedOptionId === option.id;
                            const isCorrect = option.isCorrect;
                            const showResult = isQuestionAnswered;

                            return (
                                <div
                                    key={option.id}
                                    onClick={() => handleAnswerSelect(currentQ.id, option.id)}
                                    className={`p-3 sm:p-4 rounded-lg border-2 transition-all cursor-pointer ${!showResult
                                        ? "border-gray-200 hover:border-gray-300 active:border-gray-400 bg-white"
                                        : isCorrect
                                            ? "border-green-500 bg-green-50"
                                            : isSelected
                                                ? "border-red-500 bg-red-50"
                                                : "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                                        } ${!showResult && isSelected ? "border-blue-500 bg-blue-50" : ""}`}
                                >
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                            {showResult ? (
                                                isCorrect ? (
                                                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                                ) : isSelected ? (
                                                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                                                ) : (
                                                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-gray-300" />
                                                )
                                            ) : (
                                                <div
                                                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 ${isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                                                        }`}
                                                >
                                                    {isSelected && <div className="w-full h-full rounded-full bg-white scale-50" />}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <Typography
                                                className={`text-sm sm:text-base ${showResult && isCorrect
                                                    ? "font-semibold text-green-800"
                                                    : showResult && isSelected
                                                        ? "font-semibold text-red-800"
                                                        : "text-gray-800"
                                                    }`}
                                            >
                                                <span className="font-semibold mr-1 sm:mr-2">
                                                    {String.fromCharCode(65 + index)}.
                                                </span>
                                                {option.text}
                                            </Typography>

                                            {showResult && isCorrect && option.note && (
                                                <Typography className="text-xs sm:text-sm text-green-700 mt-2 p-2 bg-green-100 rounded italic">
                                                    💡 {option.note}
                                                </Typography>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Pastki tugmalar */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 sm:p-4">
                    <div className="max-w-3xl mx-auto flex gap-2 sm:gap-3">
                        <Button
                            onClick={handlePrev}
                            disabled={currentQuestion === 0}
                            variant="outlined"
                            className="flex-1 text-sm sm:text-base py-2 sm:py-3"
                            color="blue-gray"
                        >
                            Orqaga
                        </Button>

                        {currentQuestion === questions.length - 1 ? (
                            <Button
                                onClick={() => handleSubmit(false)}
                                className="flex-1 text-sm sm:text-base py-2 sm:py-3"
                                color="green"
                            >
                                Yakunlash
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                className="flex-1 text-sm sm:text-base py-2 sm:py-3"
                                color="blue"
                            >
                                Keyingi
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}