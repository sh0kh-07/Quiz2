import { useState } from "react"
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react"
import { apiTopic } from "../../../utils/Controllers/Topic"
import { Alert } from "../../../utils/Alert"
import { useParams } from "react-router-dom"

export default function Create({ refresh }) {
    const [open, setOpen] = useState(false)
    const { id } = useParams()
    const [loading, setLoading] = useState(false)

    const [data, setData] = useState({
        moduleId: id,
        name: "",
        pdf: null,
        excel: null,
    })

    const handleOpen = () => setOpen(!open)

    const TopicCreate = async () => {
        if (!data.moduleId || !data.name || !data.pdf) {
            return Alert("Iltimos barcha required maydonlarni to‘ldiring", "error")
        }

        try {
            setLoading(true)
            const formData = new FormData()
            formData.append("moduleId", data.moduleId)
            formData.append("name", data.name)
            formData.append("pdf", data.pdf)
            if (data.excel) formData.append("excel", data.excel)

            await apiTopic.Create(formData) // backendga yuborish

            Alert("Muvaffaqiyatli yaratildi", "success")
            setData({ moduleId: "", name: "", pdf: null, excel: null })
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
                <DialogHeader>Yangi mavzu yaratish</DialogHeader>

                <DialogBody className="flex flex-col gap-4">

                    {/* Name */}
                    <Input
                        label="Topic nomi *"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                    />

                    {/* PDF */}
                    <div>
                        <p className="mb-2 text-sm font-medium">PDF fayl *</p>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setData({ ...data, pdf: e.target.files[0] })}
                        />
                    </div>

                    {/* Excel */}
                    <div>
                        <p className="mb-2 text-sm font-medium">Excel fayl (optional)</p>
                        <input
                            type="file"
                            accept=".xls,.xlsx"
                            onChange={(e) => setData({ ...data, excel: e.target.files[0] })}
                        />
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
