import { useState } from "react"
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react"
import { Pen } from "lucide-react"
import { apiTopicModule } from "../../../utils/Controllers/TopicModule"
import { Alert } from "../../../utils/Alert"

export default function Edit({ data, refresh }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const [form, setForm] = useState({
        type: data.type || "mtm",
        name: data.name || "",
        index: data.index || "",
    })

    const handleOpen = () => setOpen(!open)

    const EditModule = async () => {
        try {
            setLoading(true)
            await apiTopicModule.Put(data.id, {
                type: form.type,
                name: form.name,
                index: Number(form.index),
            })

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
            <Button color="yellow" className="p-[10px] flex items-center justify-center w-full" onClick={handleOpen}>
                <Pen color="white" className="w-4 h-4" />
            </Button>

            {/* Modal */}
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Modulni tahrirlash</DialogHeader>
                <DialogBody className="flex flex-col gap-4">
                    {/* Type tanlash */}
                    <div>
                        <p className="mb-2 text-sm font-medium">Turini tanlang</p>
                        <div className="flex gap-3 w-full">
                            <Button
                                className="w-full"
                                variant={form.type === "mtm" ? "filled" : "outlined"}
                                onClick={() => setForm({ ...form, type: "mtm" })}
                            >
                                MTM
                            </Button>
                            <Button
                                className="w-full"
                                variant={form.type === "maktab" ? "filled" : "outlined"}
                                onClick={() => setForm({ ...form, type: "maktab" })}
                            >
                                Maktab
                            </Button>
                        </div>
                    </div>

                    {/* Name input */}
                    <Input
                        label="Modul nomi"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />

                    {/* Index input */}
                    <Input
                        type="number"
                        label="Tartib raqami (index)"
                        value={form.index}
                        onChange={(e) => setForm({ ...form, index: e.target.value })}
                    />
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
                        onClick={EditModule}
                        disabled={!form.type || !form.name || !form.index || loading}
                    >
                        {loading ? "Yangilanmoqda..." : "Saqlash"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}
