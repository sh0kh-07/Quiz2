import { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Select,
    Option,
} from "@material-tailwind/react";
import { Pen } from "lucide-react";
import { apiPayment } from "../../../utils/Controllers/Payment";

export default function Edit({ data, refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(data?.status || "");

    const handleOpen = () => setOpen(!open);

    const handleEdit = async () => {
        try {
            setLoading(true);

            await apiPayment?.EditPayment(data?.id, { status });

            handleOpen();
            if (refresh) refresh();
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                className="mt-[10px] w-full flex items-center justify-center"
            >
                <Pen size={16} color="white" />
            </Button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Statusni o‘zgartirish</DialogHeader>

                <DialogBody>
                    <Select
                        label="Statusni tanlang"
                        value={status}
                        onChange={(value) => setStatus(value)}
                    >
                        <Option value="success">Muvaffaqiyatli</Option>
                        <Option value="failed">Muvaffaqiyatsiz</Option>
                    </Select>
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
                        disabled={loading}
                    >
                        {loading ? "Saqlanmoqda..." : "Saqlash"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}