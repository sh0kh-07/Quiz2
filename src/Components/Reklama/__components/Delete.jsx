import { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Typography,
} from "@material-tailwind/react";
import { Trash2 } from "lucide-react";
import { Notification } from "../../../utils/Controllers/Notification";
import { Alert } from "../../../utils/Alert";

export default function Delete({ id, refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(!open);

    const DeleteReklam = async () => {
        try {
            setLoading(true);
            await Notification.Delete(id);

            Alert("Muvaffaqiyatli", "success");
            refresh?.();
            setOpen(false);
        } catch (error) {
            console.log(error);
            Alert(
                error?.response?.data?.message || "Xatolik yuz berdi",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* OPEN BUTTON */}
            <Button
                size="sm"
                color="red"
                onClick={handleOpen}
                className="w-full flex items-center justify-center"
            >
                <Trash2 size={16} />
            </Button>
            {/* MODAL */}
            <Dialog open={open} handler={handleOpen} size="xl">
                <DialogHeader>
                    <Typography variant="h5" className="text-red-600">
                        Reklamani o‘chirish
                    </Typography>
                </DialogHeader>

                <DialogBody>
                    <Typography className="text-gray-700">
                        Siz rostdan ham ushbu reklamani o‘chirmoqchimisiz?
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
                        onClick={DeleteReklam}
                        disabled={loading}
                    >
                        {loading ? "O‘chirilmoqda..." : "Ha, o‘chirish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
