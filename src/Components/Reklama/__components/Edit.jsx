import { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Textarea,
} from "@material-tailwind/react";
import { Pen, Image as ImageIcon } from "lucide-react";
import { Notification } from "../../../utils/Controllers/Notification";
import { Alert } from "../../../utils/Alert";

export default function Edit({ data, refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (data) {
            setTitle(data.title || "");
            setNote(data.note || "");
        }
    }, [data]);

    const handleOpen = () => setOpen(!open);

    const handleEdit = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("note", note || "");

            if (image) {
                formData.append("image", image);
            }

            await Notification?.Edit(data?.id, formData);

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
                onClick={handleOpen}
                color="yellow"
                className="p-[10px] flex items-center justify-center w-full"
            >
                <Pen color="white" className="w-4 h-4" />
            </Button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Reklamani tahrirlash</DialogHeader>

                <DialogBody className="space-y-4">
                    <Input
                        label="Sarlavha *"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <Textarea
                        label="Matn"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />

                    {/* Hidden file input */}
                    <input
                        type="file"
                        id={`editImage-${data?.id}`}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file && file.type.startsWith("image/")) {
                                setImage(file);
                            }
                        }}
                    />

                    <Button
                        variant="outlined"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() =>
                            document
                                .getElementById(`editImage-${data?.id}`)
                                .click()
                        }
                    >
                        <ImageIcon className="w-4 h-4" />
                        {image ? image.name : "Rasmni o‘zgartirish"}
                    </Button>
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
                        disabled={loading || !title}
                    >
                        {loading ? "Saqlanmoqda..." : "Saqlash"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}