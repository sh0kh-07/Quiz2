import { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Typography,
} from "@material-tailwind/react";
import { QuizApi } from "../../../utils/Controllers/QuizApi";
import { Alert } from "../../../utils/Alert";

export default function Create({refresh}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [count, setCount] = useState("");
    const [time, setTime] = useState("");

    const handleOpen = () => setOpen(!open);

    const handleCreateQuiz = async () => {
        if (!name || !count || !time) {
            Alert("Barcha maydonlarni to‘ldiring", "warning");
            return;
        }

        try {
            setLoading(true);

            await QuizApi.Create({
                name,
                count: Number(count),
                time: Number(time),
            });

            Alert("Quiz muvaffaqiyatli yaratildi!", "success");

            // очистка
            setName("");
            setCount("");
            setTime("");
            refresh()
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
            {/* Кнопка открытия */}
            <Button
                onClick={handleOpen}
                className="bg-blue-500 hover:bg-blue-600"
            >
                Yaratish +
            </Button>

            {/* Modal */}
            <Dialog open={open} handler={handleOpen} size="sm">
                <DialogHeader>
                    <Typography variant="h5">
                        Yangi Quiz yaratish
                    </Typography>
                </DialogHeader>

                <DialogBody className="flex flex-col gap-4">
                    <Input
                        label="Quiz nomi"
                        placeholder="JavaScript Basics Quiz"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Input
                        label="Savollar soni"
                        type="number"
                        min={1}
                        value={count}
                        onChange={(e) => setCount(e.target.value)}
                    />

                    <Input
                        label="Vaqt (daqiqada)"
                        type="number"
                        min={1}
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
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
                        onClick={handleCreateQuiz}
                        disabled={loading}
                        className="bg-blue-500 hover:bg-blue-600"
                    >
                        {loading ? "Yaratilmoqda..." : "Yaratish"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}
