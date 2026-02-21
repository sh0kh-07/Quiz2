import { useEffect, useState } from "react"
import {
    Card,
    CardBody,
    Typography,
    Button,
    Tabs,
    TabsHeader,
    Tab,
} from "@material-tailwind/react"
import { apiTopicModule } from "../../utils/Controllers/TopicModule"
import Create from "./__components/Create"
import { ArrowLeft, ArrowRight, Eye } from "lucide-react"
import Loading from "../UI/Loadings/Loading"
import EmptyData from "../UI/NoData/EmptyData"
import Delete from "./__components/Delete"
import Edit from "./__components/Edit"
import { NavLink } from "react-router-dom"

export default function TopicModule() {
    const [type, setType] = useState("mtm")
    const [modules, setModules] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)

    const GetTopicModules = async (selectedType = type, selectedPage = page) => {
        try {
            setLoading(true)

            const response = await apiTopicModule.GetAll({
                type: selectedType,
                page: selectedPage,
            })

            const records = response?.data?.data?.records || []
            const pagination = response?.data?.data?.pagination

            setModules(records)
            setTotalPages(pagination?.totalPages || 1)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        GetTopicModules()
    }, [type, page])

    const handleTabChange = (value) => {
        setType(value)
        setPage(1)
    }

    return (
        <div className=" space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <Typography variant="h4">
                    Modul
                </Typography>
                <Create refresh={() => GetTopicModules(type, page)} />
            </div>

            {/* Tabs */}
            <Tabs value={type}>
                <TabsHeader>
                    <Tab value="mtm" onClick={() => handleTabChange("mtm")}>
                        MTM
                    </Tab>
                    <Tab value="maktab" onClick={() => handleTabChange("maktab")}>
                        Maktab
                    </Tab>
                    <Tab value="maktab_maslahatchisi" onClick={() => handleTabChange("maktab_maslahatchisi")}>
                         Maslahatchi
                    </Tab>
                </TabsHeader>
            </Tabs>

            {/* Cards */}
            {loading ? (
                <Loading />
            ) : modules.length === 0 ? (
                <EmptyData text={`Ma'lumot yo'q`} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.map((item) => (
                        <Card
                            key={item.id}
                            className="shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            <CardBody className="px-[12px]">
                                <Typography variant="h6" className="mb-2">
                                    {item.name}
                                </Typography>
                                <Typography className="text-sm text-gray-600">
                                    Tartib raqami: {item.index}
                                </Typography>

                                <Typography className="text-xs text-gray-400 mt-3">
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </Typography>
                                <div className="flex items-center gap-[5px] mt-[10px]">
                                    <NavLink className={'w-full'} to={`/topic-modules/${item?.id}`}>
                                        <Button className="p-[10px] w-full flex items-center justify-center" color="blue">
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                    </NavLink>
                                    <Edit data={item} refresh={() => GetTopicModules(type, page)} />
                                    <Delete id={item?.id} refresh={() => GetTopicModules(type, page)} />
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-3 pt-6">
                    <Button
                        variant="outlined"
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                        className="flex items-center gap-1"
                    >
                        <ArrowLeft size={16} />
                    </Button>

                    <span className="flex items-center text-sm px-2">
                        {page} / {totalPages}
                    </span>

                    <Button
                        variant="outlined"
                        disabled={page === totalPages}
                        onClick={() => setPage(page + 1)}
                        className="flex items-center gap-1"
                    >
                        <ArrowRight size={16} />
                    </Button>
                </div>
            )}
        </div>
    )
}
