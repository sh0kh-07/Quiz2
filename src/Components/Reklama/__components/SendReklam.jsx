import { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Radio,
} from "@material-tailwind/react";
import { Notification } from "../../../utils/Controllers/Notification";
import { SendIcon } from "lucide-react";
import { Alert } from "../../../utils/Alert";

export default function SendReklam({ data, refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("");

    const handleOpen = () => setOpen(!open);

    const handleSend = async () => {
        try {
            if (!category) return;

            setLoading(true);
            await Notification.Send({ notificationId: data, category });
            handleOpen();
            Alert("Muvaffaqiyatli!", "success");
            if (refresh) refresh();
        } catch (error) {
            console.log(error);
            Alert("Xatolik yuz berdi", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                color="blue"
                className="p-[10px] flex items-center justify-center w-full"
                onClick={handleOpen}
            >
                <SendIcon size={16} />
            </Button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Bildirishnomani yuborish</DialogHeader>

                <DialogBody className="space-y-4">
                    {/* Radio buttons without RadioGroup wrapper */}
                    <div className="flex flex-col gap-2">
                        <Radio
                            name="category"
                            value="maktab"
                            label="Maktab"
                            onChange={(e) => setCategory(e.target.value)}
                            checked={category === "maktab"}
                        />
                        <Radio
                            name="category"
                            value="mtm"
                            label="MTM"
                            onChange={(e) => setCategory(e.target.value)}
                            checked={category === "mtm"}
                        />
                        <Radio
                            name="category"
                            value="maktab_maslahatchisi"
                            label="Maktab Maslahatchisi"
                            onChange={(e) => setCategory(e.target.value)}
                            checked={category === "maktab_maslahatchisi"}
                        />
                    </div>
                </DialogBody>

                <DialogFooter>
                    <Button variant="text" color="red" onClick={handleOpen} className="mr-2">
                        Bekor qilish
                    </Button>
                    <Button onClick={handleSend} disabled={loading || !category}>
                        {loading ? "Yuborilmoqda..." : "Yuborish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}