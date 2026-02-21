import { useState } from "react"
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
} from "@material-tailwind/react"
import { apiTopicModule } from "../../../utils/Controllers/TopicModule"
import { Alert } from "../../../utils/Alert"

export default function Create({ refresh }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const initialState = {
        type: "mtm",
        name: "",
        index: ""
    }

    const [data, setData] = useState(initialState)

    const handleOpen = () => {
        setOpen(!open)
        if (!open) {
            setData(initialState) // har ochilganda reset
        }
    }

    const CreateTopicModule = async () => {
        try {
            setLoading(true)

            await apiTopicModule.Post({
                type: data.type,
                name: data.name.trim(),
                index: Number(data.index)
            })
            Alert('Muvaffaqiyatli', 'success')
            refresh()
            setOpen(false)
        } catch (error) {
            console.log(error)
            Alert(`Xato ${error?.message}`, 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Button onClick={handleOpen}>
                Yaratish
            </Button>

            <Dialog open={open} handler={handleOpen} size="sm">
                <DialogHeader className="justify-center text-xl font-semibold">
                    Yangi Modul Yaratish
                </DialogHeader>

                <DialogBody className="flex flex-col gap-5">

                    {/* Type tanlash */}
                    <div>
                        <p className="mb-2 text-sm font-medium">
                            Turini tanlang
                        </p>

                        <div className="flex flex-wrap gap-3 w-full">
                            <Button
                                fullWidth
                                className={`transition-all duration-300 ${data.type === "mtm"
                                    ? "shadow-lg scale-105"
                                    : ""
                                    }`}
                                variant={data.type === "mtm" ? "filled" : "outlined"}
                                onClick={() =>
                                    setData({ ...data, type: "mtm" })
                                }
                            >
                                MTM
                            </Button>

                            <Button
                                fullWidth
                                className={`transition-all duration-300 ${data.type === "maktab"
                                    ? "shadow-lg scale-105"
                                    : ""
                                    }`}
                                variant={data.type === "maktab" ? "filled" : "outlined"}
                                onClick={() =>
                                    setData({ ...data, type: "maktab" })
                                }
                            >
                                Maktab
                            </Button>
                            <Button
                                fullWidth
                                className={`transition-all duration-300 ${data.type === "maktab_maslahatchisi"
                                    ? "shadow-lg scale-105"
                                    : ""
                                    }`}
                                variant={data.type === "maktab_maslahatchisi" ? "filled" : "outlined"}
                                onClick={() =>
                                    setData({ ...data, type: "maktab_maslahatchisi" })
                                }
                            >
                                Maktab Maslahatchisi
                            </Button>
                        </div>
                    </div>

                    {/* Name */}
                    <Input
                        label="Modul nomi"
                        value={data.name}
                        onChange={(e) =>
                            setData({ ...data, name: e.target.value })
                        }
                    />

                    {/* Index */}
                    <Input
                        type="number"
                        label="Tartib raqami"
                        value={data.index}
                        onChange={(e) =>
                            setData({ ...data, index: e.target.value })
                        }
                    />

                </DialogBody>

                <DialogFooter className="flex justify-between">
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                    >
                        Bekor qilish
                    </Button>

                    <Button
                        onClick={CreateTopicModule}
                        disabled={
                            !data.name.trim() ||
                            !data.index ||
                            loading
                        }
                        className="flex items-center gap-2"
                    >
                        {loading ? "Yuborilmoqda..." : "Saqlash"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}
