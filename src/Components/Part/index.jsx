import { NavLink, useParams } from "react-router-dom"
import { apiTopic } from "../../utils/Controllers/Topic"
import { useEffect, useState } from "react"
import Create from "./__components/Create"
import {
    Card,
    CardBody,
    Typography,
    Button,
} from "@material-tailwind/react"
import {
    FileText,
    Calendar,
    ArrowLeft,
    ArrowRight,
    Eye,
} from "lucide-react"
import Loading from "../UI/Loadings/Loading"
import EmptyData from "../UI/NoData/EmptyData"
import Delete from "./__components/Delete"
import Edit from "./__components/Edit"
import ExelDownload from "./__components/ExelDownload"
import { apiParts } from "../../utils/Controllers/Parts"

export default function Topic() {
    const { id } = useParams()

    const [topics, setTopics] = useState([])
    const [page, setPage] = useState(1)
    const [pagination, setPagination] = useState(null)
    const [loading, setLoading] = useState(true)

    const GetAllTopic = async (currentPage = 1) => {
        setLoading(true)
        try {
            const response = await apiParts.GetParts({
                topicId: id,
                page: currentPage,
            })

            setTopics(response?.data?.data?.records)
            setPagination(response?.data?.data?.pagination)
            setPage(currentPage)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        GetAllTopic(1)
    }, [id])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className="">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-[25px] font-bold">Qisimlar</h1>
                <div className="flex items-center gap-[5px]">
                    <Create refresh={() => GetAllTopic(page)} />
                </div>
            </div>

            {/* Cards */}
            {topics?.length === 0 ? (
                <EmptyData text={`Ma'lumot yo'q`} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {topics?.map((item) => (
                        <Card key={item.id} className="shadow-lg border hover:shadow-xl transition">
                            <CardBody className="flex flex-col gap-3">
                                {/* Name */}
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                    <Typography variant="h6">{item.name}</Typography>
                                </div>

                                {/* Created Date */}
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-[5px]">
                                    <NavLink className={'w-full'} to={`/topic/${item?.id}`}>
                                        <Button className="p-[10px] w-full flex items-center justify-center" color="blue">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </NavLink>
                                    <Edit data={item} refresh={() => GetAllTopic(page)} />
                                    <Delete id={item?.id} refresh={() => GetAllTopic(page)} />
                                    <ExelDownload id={item?.id} />
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-3">
                    <Button
                        disabled={page === 1}
                        onClick={() => GetAllTopic(page - 1)}
                    >
                        <ArrowLeft size={16} />
                    </Button>

                    <span className="flex items-center px-3">
                        {pagination.currentPage} / {pagination.totalPages}
                    </span>

                    <Button
                        disabled={page === pagination.totalPages}
                        onClick={() => GetAllTopic(page + 1)}
                    >
                        <ArrowRight size={16} />
                    </Button>
                </div>
            )}
        </div>
    )
}
