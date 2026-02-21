import { useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Input,
    Textarea,
} from "@material-tailwind/react";
import { Image as ImageIcon } from "lucide-react";
import { Notification } from "../../../utils/Controllers/Notification";
import { Alert } from "../../../utils/Alert";

export default function Create({ refresh }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [note, setNote] = useState("");
    const [image, setImage] = useState(null);

    const handleOpen = () => setOpen(!open);

    const handleCreate = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("title", title);
            formData.append("note", note || "");
            if (image) formData.append("image", image);

            await Notification.Create(formData);

            setTitle("");
            setNote("");
            setImage(null);

            handleOpen();
            if (refresh) refresh();
            Alert("Muvaffaqiyatli!", "success");


        } catch (error) {
            console.log(error);
            Alert("Xatolik yuz berdi", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button onClick={handleOpen}>
                + Yaratish
            </Button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Bildirishnoma yaratish</DialogHeader>

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

                    {/* Hidden input */}
                    {/* Hidden input */}
                    <input
                        type="file"
                        id="imageUpload"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file && file.type.startsWith("image/")) {
                                setImage(file);
                            }
                        }}
                    />

                    {/* Button as file input */}
                    <Button
                        variant="outlined"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => document.getElementById("imageUpload").click()}
                    >
                        <ImageIcon className="w-4 h-4" />
                        {image ? image.name : "Rasm yuklash"}
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
                        onClick={handleCreate}
                        disabled={loading || !title}
                    >
                        {loading ? "Yuklanmoqda..." : "Saqlash"}
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}