import { useState, useEffect } from "react"
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react"
import { Pen } from "lucide-react"
import { apiTopic } from "../../../utils/Controllers/Topic"
import { Alert } from "../../../utils/Alert"

export default function Edit({ data, refresh }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        name: "",
        pdf: null,
        excel: null,
    })

    useEffect(() => {
        if (data) {
            setForm({
                name: data.name || "",
                pdf: null,
                excel: null,
            })
        }
    }, [data])

    const handleOpen = () => setOpen(!open)

    const handleEdit = async () => {
        try {
            setLoading(true)

            const formData = new FormData()
            formData.append("name", form.name)
            if (form.pdf) formData.append("pdf", form.pdf)
            if (form.excel) formData.append("excel", form.excel)
            await apiTopic.Update(data.id, formData)
            Alert("Muvaffaqiyatli yangilandi", "success")
            setOpen(false)
            refresh()
        } catch (error) {
            Alert(`Xato: ${error?.message}`, "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Edit button */}
            <Button
                color="yellow"
                className="p-[10px] flex items-center justify-center w-full"
                onClick={handleOpen}
            >
                <Pen color="white" className="w-4 h-4" />
            </Button>

            {/* Modal */}
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Mavzuni tahrirlash</DialogHeader>

                <DialogBody className="flex flex-col gap-4">
                    {/* Name */}
                    <Input
                        label="Topic nomi"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />

                    {/* PDF */}
                    <div>
                        <p className="mb-2 text-sm font-medium">
                            Yangi PDF (optional)
                        </p>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) =>
                                setForm({ ...form, pdf: e.target.files[0] })
                            }
                        />
                    </div>

                    {/* Excel */}
                    <div>
                        <p className="mb-2 text-sm font-medium">
                            Yangi Excel (optional)
                        </p>
                        <input
                            type="file"
                            accept=".xls,.xlsx"
                            onChange={(e) =>
                                setForm({ ...form, excel: e.target.files[0] })
                            }
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
                        onClick={handleEdit}
                        disabled={!form.name || loading}
                    >
                        {loading ? "Yangilanmoqda..." : "Saqlash"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}
