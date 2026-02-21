import { useState } from "react"
import { Button, Dialog, DialogHeader, DialogBody, DialogFooter, Typography } from "@material-tailwind/react"
import { Trash2 } from "lucide-react"
import { apiTopicModule } from "../../../utils/Controllers/TopicModule"
import { Alert } from "../../../utils/Alert"

export default function Delete({ id, refresh }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleOpen = () => setOpen(!open)

    const DeleteModule = async () => {
        try {
            setLoading(true)
            await apiTopicModule.Delete(id)
            refresh() // listni refresh qiladi
            Alert("Muvaffaqiyatli", "success")
            setOpen(false)
        } catch (error) {
            Alert(`Xato: ${error?.message}`, "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            {/* Delete Button */}
            <Button color="red" className="p-[10px] flex items-center justify-center w-full" onClick={handleOpen}>
                <Trash2 className="w-4 h-4" />
            </Button>

            {/* Confirmation Modal */}
            <Dialog open={open} handler={handleOpen} size="xl">
                <DialogHeader>
                    <Typography variant="h5" className="text-red-600">
                        Modulni o‘chirish
                    </Typography>
                </DialogHeader>

                <DialogBody>
                    <Typography className="text-gray-700">
                        Siz rostdan ham ushbu modulni o‘chirmoqchimisiz?
                        <br />
                        <span className="text-red-500 font-semibold">
                            Bu amalni ortga qaytarib bo‘lmaydi.
                        </span>
                    </Typography>
                </DialogBody>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="text"
                        color="gray"
                        onClick={handleOpen}
                    >
                        Bekor qilish
                    </Button>

                    <Button
                        color="red"
                        onClick={DeleteModule}
                        disabled={loading}
                    >
                        {loading ? "O‘chirilmoqda..." : "Ha, o‘chirish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
}
