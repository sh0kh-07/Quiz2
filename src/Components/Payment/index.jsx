import { useEffect, useState } from "react"
import {
    Card,
    Typography,
    Button,
    Badge,
    Tabs,
    TabsHeader,
    Tab,
    Dialog,
    DialogBody,
    IconButton,
} from "@material-tailwind/react"
import {
    CreditCard,
    Building2,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Image as ImageIcon,
    Download,
    Wallet,
    Banknote,
    X,
    ZoomIn,
    ZoomOut,
    User,
    Phone,
    MapPin,
    Briefcase,
    Hash,
} from "lucide-react"
import { format } from "date-fns"
import { apiPayment } from "../../utils/Controllers/Payment"
import Edit from "./__components/Edit"
import CONFIG from "../../utils/Config"

export default function Payment() {
    // Состояния для фильтров
    const [activeStatusTab, setActiveStatusTab] = useState("success")
    const [activeMethodTab, setActiveMethodTab] = useState("card")

    const [payments, setPayments] = useState([])
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0
    })
    const [loading, setLoading] = useState(false)

    // Состояния для модального окна с изображением
    const [imageModalOpen, setImageModalOpen] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [zoomLevel, setZoomLevel] = useState(1)

    // Конфигурация статусов
    const statusTabs = [
        { value: "success", label: "Muvaffaqiyatli", icon: CheckCircle, color: "text-green-600" },
        { value: "failed", label: "Bekor qilingan", icon: XCircle, color: "text-red-600" },
    ]

    // Конфигурация методов оплаты
    const methodTabs = [
        { value: "card", label: "Karta", icon: CreditCard },
        { value: "click", label: "Click", icon: Wallet },
    ]

    const getAllPayment = async (page = 1) => {
        try {
            setLoading(true)
            const response = await apiPayment.GetPayment({
                status: activeStatusTab,
                method: activeMethodTab,
                page
            })

            if (response.data) {
                setPayments(response.data.data?.records || [])
                setPagination(response.data.data?.pagination || {
                    currentPage: 1,
                    totalPages: 1,
                    totalCount: 0
                })
            }
        } catch (error) {
            console.log(error)
            setPayments([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllPayment(1)
    }, [activeStatusTab, activeMethodTab])

    const handlePageChange = (newPage) => {
        getAllPayment(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString)
            return {
                full: format(date, "dd.MM.yyyy HH:mm"),
                time: format(date, "HH:mm"),
                date: format(date, "dd.MM.yyyy"),
                relative: format(date, "dd MMM")
            }
        } catch {
            return {
                full: dateString,
                time: dateString,
                date: dateString,
                relative: dateString
            }
        }
    }

    const formatAmount = (amount) => {
        const num = parseFloat(amount)
        return new Intl.NumberFormat('uz-UZ', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(num) + " so'm"
    }

    const getMethodIcon = (method) => {
        switch (method) {
            case 'card': return <CreditCard className="w-4 h-4" />
            case 'click': return <Wallet className="w-4 h-4" />
            default: return <CreditCard className="w-4 h-4" />
        }
    }

    const getMethodLabel = (method) => {
        switch (method) {
            case 'card': return "Karta"
            case 'click': return "Pul o'tkazmasi"
            default: return method
        }
    }

    const getStatusConfig = (status) => {
        switch (status) {
            case 'success':
                return {
                    label: "Muvaffaqiyatli",
                    icon: CheckCircle,
                    color: "text-green-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200"
                }
            case 'failed':
                return {
                    label: "Bekor qilingan",
                    icon: XCircle,
                    color: "text-red-600",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200"
                }
            default:
                return {
                    label: status,
                    icon: Clock,
                    color: "text-gray-600",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200"
                }
        }
    }

    const viewReceipt = (receiptImage) => {
        if (!receiptImage) return
        const imageUrl = `${CONFIG?.API_URL}/${receiptImage}`
        setSelectedImage(imageUrl)
        setImageModalOpen(true)
        setZoomLevel(1)
    }

    const closeImageModal = () => {
        setImageModalOpen(false)
        setSelectedImage(null)
        setZoomLevel(1)
    }

    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 0.25, 3))
    }

    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 0.25, 0.5))
    }

    const getSubscriptionPlanLabel = (plan) => {
        switch (plan) {
            case 'basic 200':
                return "Basic 200"
            case 'basic 500':
                return "Basic 500"
            case 'premium':
                return "Premium"
            default:
                return plan
        }
    }

    const getSubscriptionEndDate = (endDate) => {
        const date = new Date(endDate)
        const today = new Date()
        const diffTime = date - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays > 0) {
            return `${diffDays} kun qoldi`
        } else if (diffDays === 0) {
            return "Bugun tugaydi"
        } else {
            return `${Math.abs(diffDays)} kun oldin tugagan`
        }
    }

    return (
        <div className="pb-20">
            {/* Заголовок */}
            <Card className="sticky top-0 px-[10px] bg-white z-10 py-4 border-b border-gray-200 mb-4">
                <Typography variant="h5" className="font-bold text-gray-900">
                    To'lovlar tarixi
                </Typography>
                {pagination.totalCount > 0 && (
                    <Typography variant="small" color="gray" className="mt-1">
                        Jami: {pagination.totalCount} ta to'lov
                    </Typography>
                )}
            </Card>

            {/* Фильтры */}
            <div className="space-y-3 mb-4">
                {/* Табы статусов */}
                <Tabs value={activeStatusTab} className="w-full">
                    <TabsHeader className="bg-gray-100 p-1 rounded-lg">
                        {statusTabs.map(({ value, label, icon: Icon, color }) => (
                            <Tab
                                key={value}
                                value={value}
                                onClick={() => setActiveStatusTab(value)}
                                className={`flex items-center justify-center gap-1 py-2 text-xs font-medium transition-all ${activeStatusTab === value ? "text-gray-900" : "text-gray-600"
                                    }`}
                            >
                                <div className="flex items-center gap-[5px]">
                                    <Icon className={`w-4 h-4 ${activeStatusTab === value ? color : "text-gray-500"}`} />
                                    <span>{label}</span>
                                </div>
                            </Tab>
                        ))}
                    </TabsHeader>
                </Tabs>

                {/* Табы методов оплаты */}
                <Tabs value={activeMethodTab} className="w-full">
                    <TabsHeader className="bg-gray-100 p-1 rounded-lg">
                        {methodTabs.map(({ value, label, icon: Icon }) => (
                            <Tab
                                key={value}
                                value={value}
                                onClick={() => setActiveMethodTab(value)}
                                className={`flex items-center justify-center gap-1 py-2 text-xs font-medium transition-all ${activeMethodTab === value ? "text-gray-900" : "text-gray-600"
                                    }`}
                            >
                                <div className="flex items-center gap-[5px]">
                                    <Icon className="w-4 h-4" />
                                    <span>{label}</span>
                                </div>
                            </Tab>
                        ))}
                    </TabsHeader>
                </Tabs>
            </div>

            {/* Список платежей */}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <Card key={i} className="p-4 animate-pulse">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-5 bg-gray-200 rounded w-20"></div>
                                </div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                <div className="h-8 bg-gray-200 rounded w-full"></div>
                            </div>
                        </Card>
                    ))
                ) : payments.length > 0 ? (
                    payments.map((payment) => {
                        const status = getStatusConfig(payment.status)
                        const StatusIcon = status.icon
                        const date = formatDate(payment.createdAt)
                        const MethodIcon = getMethodIcon(payment.method)
                        const subscription = payment.subscription
                        const user = subscription?.user

                        return (
                            <Card
                                key={payment.id}
                                className={`p-4 border-l-4 ${status.borderColor} hover:shadow-md transition-shadow`}
                            >
                                {/* Верхняя часть с суммой и статусом */}
                                <div className="flex items-center justify-between mb-3">
                                    <Typography variant="h6" className="font-bold text-gray-900">
                                        {formatAmount(payment.amount)}
                                    </Typography>
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${status.bgColor}`}>
                                        <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
                                        <span className={`text-xs font-medium ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </div>
                                </div>

                                {/* Информация о подписке */}
                                {subscription && (
                                    <div className="mb-3 p-2 bg-blue-50 rounded-lg">
                                        <Typography variant="small" className="font-semibold text-gray-700 mb-1 text-xs">
                                            Obuna ma'lumotlari
                                        </Typography>
                                        <div className="space-y-1 text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Plan:</span>
                                                <span className="font-medium">{getSubscriptionPlanLabel(subscription.plan)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Boshlanish:</span>
                                                <span className="font-medium">{formatDate(subscription.startDate).date}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Tugash:</span>
                                                <span className="font-medium">{formatDate(subscription.endDate).date}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] ${subscription.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {subscription.status === 'active' ? 'Aktiv' : subscription.status}
                                                </span>
                                               
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Информация о пользователе */}
                                {user && (
                                    <div className="mb-3 p-2 bg-purple-50 rounded-lg">
                                        <Typography variant="small" className="font-semibold text-gray-700 mb-1 text-xs">
                                            Foydalanuvchi
                                        </Typography>
                                        <div className="space-y-1 text-xs">
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3 text-gray-600" />
                                                <span className="font-medium">{user.full_name}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="w-3 h-3 text-gray-600" />
                                                <span>{user.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3 text-gray-600" />
                                                <span>{user.address}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Briefcase className="w-3 h-3 text-gray-600" />
                                                <span>{user.category} - {user.position}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Hash className="w-3 h-3 text-gray-600" />
                                                <span>ID: {user.chatId}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Детали платежа */}
                                <div className="space-y-2 mb-3">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        {MethodIcon}
                                        <span className="text-xs">{getMethodLabel(payment.method)}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs">{date.full}</span>
                                    </div>

                                    {payment.paidAt && (
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span className="text-xs">To'langan: {formatDate(payment.paidAt).full}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Квитанция */}
                                {payment.receiptImage && (
                                    <Button
                                        variant="outlined"
                                        size="sm"
                                        onClick={() => viewReceipt(payment.receiptImage)}
                                        className="w-full flex items-center justify-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                        <span className="text-xs">Kvitansiyani ko'rish</span>
                                        <Download className="w-3.5 h-3.5" />
                                    </Button>
                                )}
                                <Edit data={payment} refresh={() => getAllPayment(pagination.currentPage)} />
                            </Card>
                        )
                    })
                ) : (
                    // Пустое состояние
                    <Card className="p-8">
                        <div className="text-center">
                            <Wallet className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <Typography variant="h6" color="gray" className="font-normal">
                                To'lovlar topilmadi
                            </Typography>
                            <Typography variant="small" color="gray" className="mt-1">
                                {statusTabs.find(t => t.value === activeStatusTab)?.label} to'lovlar mavjud emas
                            </Typography>
                        </div>
                    </Card>
                )}

                {/* Пагинация */}
                {!loading && payments.length > 0 && pagination.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                        <Button
                            variant="outlined"
                            size="sm"
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage <= 1}
                            className="border-gray-300 flex items-center gap-1 py-1 px-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-xs">Oldingi</span>
                        </Button>
                        <Typography variant="small" color="gray" className="text-xs">
                            {pagination.currentPage} / {pagination.totalPages}
                        </Typography>
                        <Button
                            variant="outlined"
                            size="sm"
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage >= pagination.totalPages}
                            className="border-gray-300 flex items-center gap-1 py-1 px-2"
                        >
                            <span className="text-xs">Keyingi</span>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Модальное окно для просмотра изображения */}
            <Dialog
                open={imageModalOpen}
                handler={closeImageModal}
                size="xl"
                className="bg-transparent shadow-none"
            >
                <DialogBody className="relative flex items-center justify-center p-0 min-h-[500px]">
                    {/* Контейнер с изображением */}
                    <div className="relative z-10 max-w-[90vw] max-h-[90vh] bg-transparent">
                        {/* Кнопка закрытия */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                closeImageModal();
                            }}
                            className="absolute -top-14 right-0 z-30 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Кнопки зума */}
                        <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleZoomOut();
                                }}
                                disabled={zoomLevel <= 0.5}
                                className="w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ZoomOut className="w-4 h-4" />
                            </button>
                            <span className="bg-white/90 px-3 py-1 rounded-lg text-sm font-medium">
                                {Math.round(zoomLevel * 100)}%
                            </span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleZoomIn();
                                }}
                                disabled={zoomLevel >= 3}
                                className="w-8 h-8 flex items-center justify-center bg-white/90 hover:bg-white rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ZoomIn className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Изображение */}
                        {selectedImage && (
                            <div
                                className="overflow-auto rounded-lg bg-transparent"
                                style={{ maxHeight: '70vh', maxWidth: '80vw' }}
                            >
                                <img
                                    src={selectedImage}
                                    alt="Receipt"
                                    style={{
                                        transform: `scale(${zoomLevel})`,
                                        transition: 'transform 0.2s ease-in-out',
                                        transformOrigin: 'center center',
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block'
                                    }}
                                    className="rounded-lg"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        )}
                    </div>
                </DialogBody>
            </Dialog>
        </div>
    )
}