import { useState, useEffect } from "react"
import { apiTopic } from "../../utils/Controllers/Topic"
import { useParams, useNavigate } from "react-router-dom"
import {
    Card, CardBody, Typography, Button, IconButton
} from "@material-tailwind/react"
import {
    ChevronLeft, ChevronRight, FileText, Lock, Unlock,
    BookOpen, Download, Grid, List, Search,
    CheckCircle
} from "lucide-react"
import Swal from "sweetalert2"
import CONFIG from "../../utils/Config"
import { apiParts } from "../../utils/Controllers/Parts"

export default function UserPart() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [topics, setTopics] = useState([])
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0
    })
    const telegramUserId = localStorage.getItem('telegramChatId')

    const GetAllTheme = async (page = 1) => {
        try {
            setLoading(true)
            const response = await apiParts?.GetPartsForUser({
                id,
                page,
                telegramUserId
            })

            console.log("Topics response:", response)

            if (response?.status === 200 && response?.data) {
                setTopics(response.data.data?.records || [])
                setPagination({
                    currentPage: response?.data.data.pagination?.currentPage || 1,
                    totalPages: response?.data.data.pagination?.totalPages || 1,
                    totalCount: response?.data.data.pagination?.totalCount || 0
                })
            }
        } catch (error) {
            console.error("Mavzularni yuklashda xatolik:", error)
            Swal.fire({
                icon: 'error',
                title: 'Xatolik',
                text: 'Mavzularni yuklab bo‘lmadi',
                timer: 2000,
                showConfirmButton: false
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            GetAllTheme(1)
        }
    }, [id])

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            GetAllTheme(newPage)
        }
    }

    const handleTopicClick = (topic) => {
        if (topic.status === 'locked') {
            Swal.fire({
                icon: 'info',
                title: 'Mavzu bloklangan',
                text: 'Avval oldingi mavzularni tugatishingiz kerak',
                timer: 2000,
                showConfirmButton: false
            })
            return
        }
        // Mavzu sahifasiga o'tish
        navigate(`/theme/${topic.id}`)
    }

    const handleDownloadPdf = (topic, e) => {
        e.stopPropagation()
        if (topic.pdf) {
            // PDF ni yuklab olish
            window.open(`${CONFIG?.API_URL}/${topic.pdf}`, '_blank')
        }
    }

    // Statusga qarab ikonka va matn
    const getStatusInfo = (status) => {
        switch (status) {
            case 'locked':
                return {
                    icon: <Lock size={18} className="text-red-500" />,
                    text: 'Bloklangan',
                    color: 'text-red-500',
                    bgColor: 'bg-red-50'
                }
            case 'completed':
                return {
                    icon: <CheckCircle size={18} className="text-green-500" />,
                    text: 'Tugallangan',
                    color: 'text-green-500',
                    bgColor: 'bg-green-50'
                }
            default:
                return {
                    icon: <Unlock size={18} className="text-blue-500" />,
                    text: 'Mavjud',
                    color: 'text-blue-500',
                    bgColor: 'bg-blue-50'
                }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="px-4 py-4">
                    {/* Orqaga qaytish tugmasi va sarlavha */}
                    <div className="flex items-center gap-3 mb-3">
                        <IconButton
                            size="sm"
                            variant="text"
                            onClick={() => navigate(-1)}
                            className="rounded-lg"
                        >
                            <ChevronLeft size={20} />
                        </IconButton>
                        <Typography variant="h4" className="font-bold text-gray-800">
                            📚 Qisimlar
                        </Typography>
                    </div>

                    {/* Statistika va ko'rinish */}
                    <div className="flex justify-between items-center">
                        <div className="flex gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                                <BookOpen size={16} />
                                <span>{pagination.totalCount} ta qism</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Asosiy qism */}
            <div className="p-4">
                {loading ? (
                    [...Array(4)].map((_, i) => (
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
                        {/* Mavzular ro'yxati */}
                        {topics.length > 0 ? (
                            <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            }>
                                {topics.map((topic, index) => {
                                    const status = getStatusInfo(topic.status)

                                    return (
                                        <Card
                                            key={topic.id}
                                            className={`cursor-pointer transition-all hover:shadow-lg ${topic.status === 'locked' ? 'opacity-75' : 'hover:scale-102'
                                                }`}
                                            onClick={() => handleTopicClick(topic)}
                                        >
                                            <CardBody className="p-4">
                                                {/* Yuqori qism */}
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-2">
                                                        {/* Indeks (agar mavjud bo'lsa) */}
                                                        <div className={`w-8 h-8 ${status.bgColor} rounded-full flex items-center justify-center`}>
                                                            <span className={`font-bold ${status.color}`}>
                                                                {index + 1}
                                                            </span>
                                                        </div>
                                                        <Typography variant="h6" className="font-semibold line-clamp-1">
                                                            {topic.name}
                                                        </Typography>
                                                    </div>

                                                    {/* Status */}
                                                    <div className="flex items-center gap-1">
                                                        {status.icon}
                                                        <span className={`text-xs ${status.color} hidden sm:inline`}>
                                                            {status.text}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Tugmalar */}
                                                <div className="flex gap-2 mt-3">
                                                    {topic.status !== 'locked' && (
                                                        <Button
                                                            size="sm"
                                                            color="blue"
                                                            className="w-full"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleTopicClick(topic)
                                                            }}
                                                        >
                                                            Boshlash
                                                        </Button>
                                                    )}
                                                    {(topic.pdf && topic.status !== 'locked') ? (
                                                        <Button
                                                            size="sm"
                                                            color="green"
                                                            variant="outlined"
                                                            onClick={(e) => handleDownloadPdf(topic, e)}
                                                            className="rounded-lg w-full"
                                                        >
                                                            Maruzani korish
                                                        </Button>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                            </CardBody>
                                        </Card>
                                    )
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
                                        Mavzular mavjud emas
                                    </Typography>
                                    <Typography className="text-gray-500">
                                        Bu modulda hali mavzular yo'q
                                    </Typography>
                                    <Button
                                        color="blue"
                                        variant="outlined"
                                        className="mt-4"
                                        onClick={() => GetAllTheme(1)}
                                    >
                                        Yangilash
                                    </Button>
                                </CardBody>
                            </Card>
                        )}
                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="mt-6 flex flex-col items-center gap-4">
                                <div className="flex justify-center items-center gap-2">
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
                                            const pageNum = i + 1
                                            // Faqat joriy sahifa va qo'shnilarini ko'rsatish
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
                                                )
                                            } else if (
                                                pageNum === pagination.currentPage - 2 ||
                                                pageNum === pagination.currentPage + 2
                                            ) {
                                                return <span key={pageNum} className="px-2">...</span>
                                            }
                                            return null
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
                                {/* Sahifa haqida ma'lumot */}
                                <div className="text-sm text-gray-500">
                                    Jami {pagination.totalCount} ta mavzudan{' '}
                                    {(pagination.currentPage - 1) * 10 + 1} -{' '}
                                    {Math.min(pagination.currentPage * 10, pagination.totalCount)} tasi ko'rsatilmoqda
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}