import { useState } from "react";
import {
    Button,
    Card,
    CardBody,
    Input,
    Textarea,
    Typography,
} from "@material-tailwind/react";
import { Plus, Trash2 } from "lucide-react";
import { QuestionApi } from "../../utils/Controllers/QuestionApi";
import { Alert } from "../../utils/Alert";
import { useParams } from "react-router-dom";

export default function CreateQuestion({ refresh }) {
    const { id } = useParams(); // quizId
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);

    const [options, setOptions] = useState([
        {
            id: crypto.randomUUID(),
            text: "",
            isCorrect: false,
            note: "",
        },
    ]);

    const handleOptionChange = (id, key, value) => {
        setOptions(prev =>
            prev.map(opt =>
                opt.id === id ? { ...opt, [key]: value } : opt
            )
        );
    };

    const addOption = () => {
        setOptions(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                text: "",
                isCorrect: false,
                note: "",
            },
        ]);
    };

    const removeOption = (id) => {
        setOptions(prev => prev.filter(opt => opt.id !== id));
    };

    const handleSubmit = async () => {
        if (!question.trim()) {
            Alert("Savolni kiriting", "warning");
            return;
        }

        if (options.some(o => !o.text.trim())) {
            Alert("Barcha javoblarni to‘ldiring", "warning");
            return;
        }

        if (!options.some(o => o.isCorrect)) {
            Alert("Kamida bitta to‘g‘ri javob tanlang", "warning");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                quizId: id,
                question,
                options: options.map(o => ({
                    text: o.text,
                    isCorrect: o.isCorrect,
                    note: o.note || "", // ⬅️ отправляется всегда
                })),
            };

            await QuestionApi.Create(payload);
            Alert("Savol muvaffaqiyatli yaratildi!", "success");

            setQuestion("");
            setOptions([
                {
                    id: crypto.randomUUID(),
                    text: "",
                    isCorrect: false,
                    note: "",
                },
            ]);

            refresh?.();
        } catch (err) {
            console.log(err);
            Alert("Xatolik yuz berdi", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className=" border shadow-sm rounded-xl">
            <CardBody className="flex flex-col gap-5">
                <Typography variant="h5">
                    Yangi savol yaratish
                </Typography>

                {/* Savol */}
                <Textarea
                    label="Savol"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    rows={3}
                />

                {/* Javoblar */}
                {options.map((opt, index) => (
                    <div
                        key={opt.id}
                        className="border rounded-lg p-4 flex flex-col gap-3"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex-1">
                                <Input
                                    label={`Javob ${index + 1}`}
                                    value={opt.text}
                                    onChange={(e) =>
                                        handleOptionChange(
                                            opt.id,
                                            "text",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={opt.isCorrect}
                                    onChange={(e) =>
                                        handleOptionChange(
                                            opt.id,
                                            "isCorrect",
                                            e.target.checked
                                        )
                                    }
                                />
                                To‘g‘ri
                            </label>

                            {options.length > 1 && (
                                <Button
                                    variant="text"
                                    color="red"
                                    size="sm"
                                    onClick={() => removeOption(opt.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>

                        {/* NOTE показывается ТОЛЬКО если правильный */}
                        {opt.isCorrect && (
                            <Textarea
                                label="Izoh (nega to‘g‘ri)"
                                value={opt.note}
                                onChange={(e) =>
                                    handleOptionChange(
                                        opt.id,
                                        "note",
                                        e.target.value
                                    )
                                }
                                rows={2}
                            />
                        )}
                    </div>
                ))}

                <Button
                    variant="outlined"
                    size="sm"
                    onClick={addOption}
                    className="w-fit flex gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Yangi javob
                </Button>

                <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    {loading ? "Saqlanmoqda..." : "Savol yaratish"}
                </Button>
            </CardBody>
        </Card>
    );
}
