import { useState } from "react";
import {
    Card,
    CardBody,
    Typography,
    Input,
    Button,
} from "@material-tailwind/react";
import { Eye, EyeOff, Phone, Lock } from "lucide-react";
import { Auth } from "../../utils/Controllers/Auth";
import { Alert } from "../../utils/Alert";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [phone, setPhone] = useState("+998");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 👉 только цифры
    const handlePhoneChange = (e) => {
        let value = e.target.value;

        // оставляем только цифры и +
        value = value.replace(/[^\d+]/g, "");

        // + может быть только первым
        if (value.includes("+")) {
            value =
                "+" +
                value
                    .replace(/\+/g, "")
                    .replace(/\D/g, "");
        }

        // ограничение до 13 символов
        if (value.length > 13) {
            value = value.slice(0, 13);
        }

        setPhone(value);
    };

    const handleLogin = async () => {
        if (!phone || !password) {
            Alert("Telefon va parolni kiriting", "warning");
            return;
        }

        try {
            setLoading(true);

            // Убираем "+" перед отправкой на backend
            const cleanPhone = phone.replace(/\+/g, "");

            const response = await Auth.Login({
                phone: cleanPhone,
                password,
            });

            const { newUser, tokens } = response?.data;

            // ✅ сохраняем всё нужное
            localStorage.setItem("access_token", tokens.access_token);
            localStorage.setItem("refresh_token", tokens.refresh_token);
            localStorage.setItem("user_id", newUser.id);
            localStorage.setItem("role", newUser.role);

            Alert("Muvaffaqiyatli!", "success");

            navigate("/topic-modules");

        } catch (error) {
            console.log(error);
            Alert(
                error?.response?.data?.message || "Xatolik yuz berdi!",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <Card className="w-full max-w-md shadow-lg border border-gray-200">
                <CardBody className="flex flex-col gap-6">
                    {/* Title */}
                    <div className="text-center">
                        <Typography variant="h4" className="text-black">
                            Tizimga kirish
                        </Typography>
                        <Typography className="text-gray-600 text-sm mt-1">
                            Telefon raqam va parolingizni kiriting
                        </Typography>
                    </div>

                    {/* Phone */}
                    <Input
                        label="Telefon raqam"
                        icon={<Phone size={18} />}
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="+998901234567"
                        inputMode="tel"
                    />

                    {/* Password */}
                    <div className="relative">
                        <Input
                            type={showPassword ? "text" : "password"}
                            label="Parol"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") handleLogin();
                            }}
                        />

                        {/* 👁 правильная позиция */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>

                    {/* Button */}
                    <Button
                        onClick={handleLogin}
                        disabled={loading}
                        className="bg-black text-white hover:bg-gray-900 transition"
                        fullWidth
                    >
                        {loading ? "Kutilmoqda..." : "Kirish"}
                    </Button>

                    {/* Footer */}
                    <Typography className="text-center text-sm text-gray-500">
                        © 2026 Barcha huquqlar himoyalangan
                    </Typography>
                </CardBody>
            </Card>
        </div>
    );
}