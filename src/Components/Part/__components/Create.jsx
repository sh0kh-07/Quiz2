import { useState } from "react"
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react"
import { Alert } from "../../../utils/Alert"
import { useParams } from "react-router-dom"
import { apiParts } from "../../../utils/Controllers/Parts"

const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes) return '0 Bayt'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bayt', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default function Create({ refresh }) {
    const [open, setOpen] = useState(false)
    const { id } = useParams()
    const [loading, setLoading] = useState(false)

    const [data, setData] = useState({
        moduleId: id,
        name: "",
        pdf: null,
    })

    const handleOpen = () => setOpen(!open)

    const TopicCreate = async () => {
        if (!data.moduleId || !data.name || !data.pdf) {
            return Alert("Iltimos barcha required maydonlarni to‘ldiring", "error")
        }

        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("topicId", data.moduleId)
            formData.append("name", data.name)
            formData.append("excel", data.pdf)

            await apiParts.CreateParts(formData)

            Alert("Muvaffaqiyatli yaratildi", "success")
            setData({ moduleId: "", name: "", pdf: null })
            setOpen(false)
            if (refresh) refresh()
        } catch (error) {
            Alert(`Xato: ${error?.message}`, "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button color="blue" onClick={handleOpen}>
                + Yangi
            </Button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Yangi qisim yaratish</DialogHeader>

                <DialogBody className="flex flex-col gap-4">

                    <Input
                        label="Qisim nomi *"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                    />

                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">Exel shablon fayl</p>
                        <div className="flex items-center gap-4">
                            <input
                                type="file"
                                accept=".xlsx"
                                className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                onChange={(e) => setData({ ...data, pdf: e.target.files[0] })}
                            />
                            {data.pdf && (
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    {formatBytes(data.pdf.size)}
                                </span>
                            )}
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-2"
                    >
                        Bekor qilish
                    </Button>
                    <Button
                        color="green"
                        onClick={TopicCreate}
                        disabled={!data.moduleId || !data.name || !data.pdf || loading}
                    >
                        {loading ? "Yuborilmoqda..." : "Saqlash"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}
