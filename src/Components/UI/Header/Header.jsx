import { useEffect, useState } from "react";
import {
    Navbar,
    Typography,
    IconButton,
} from "@material-tailwind/react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useTranslation } from 'react-i18next';

export default function Header() {
    // По умолчанию светлая тема
    const [dark, setDark] = useState(() => {
        // Проверяем тему ДО первого рендера
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem("theme");
            if (savedTheme === "dark") {
                document.documentElement.classList.add("dark");
                return true;
            } else if (savedTheme === "light") {
                document.documentElement.classList.remove("dark");
                return false;
            }
            // Если тема не сохранена - по умолчанию светлая
            document.documentElement.classList.remove("dark");
            return false;
        }
        return false;
    });
    const scrollToNextSection = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const [scrolled, setScrolled] = useState(false);
    const { t, i18n } = useTranslation();

    const languages = ["ru", "uz", "en"];
    const currentLang = i18n.language || "ru";

    // 🔁 Language toggle
    const toggleLang = () => {
        const currentIndex = languages.indexOf(currentLang);
        const nextIndex = (currentIndex + 1) % languages.length;
        const nextLang = languages[nextIndex];
        i18n.changeLanguage(nextLang);
    };

    // Применяем тему при изменении
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    // Слушатель прокрутки
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full px-4">
            <Navbar
                className={`
                    mx-auto max-w-4xl rounded-full px-6 py-3 transition-all duration-300
                    ${scrolled
                        ? "bg-white/80 dark:bg-card-dark/80 backdrop-blur-lg shadow-xl border border-gray-200/30 dark:border-gray-700/30"
                        : "bg-white dark:bg-card-dark shadow-2xl border border-gray-100 dark:border-gray-700"
                    }
                `}
            >
                <div className="flex items-center justify-between">
                    {/* LEFT */}
                    <Typography
                        onClick={scrollToNextSection}
                        variant="h6"
                        className="font-bold cursor-pointer text-text-light dark:text-text-dark tracking-tight"
                    >
                        Wisdom
                    </Typography>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">
                        {/* 🌍 Language Toggle */}
                        <IconButton
                            onClick={toggleLang}
                            size="sm"
                            variant="outlined"
                            className="
                                w-[44px] h-[44px]
                                rounded-full
                                bg-white dark:bg-card-dark
                                border border-gray-200 dark:border-gray-700
                                text-text-light dark:text-text-dark
                                shadow-sm
                                hover:shadow-md
                                transition-all
                            "
                        >
                            <span className="text-sm font-semibold uppercase">
                                {currentLang}
                            </span>
                        </IconButton>

                        {/* 🌙 Dark Mode Toggle */}
                        <IconButton
                            onClick={() => setDark(!dark)}
                            className={`
                                rounded-full transition-all duration-300 shadow-md hover:shadow-lg
                                ${dark
                                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:shadow-yellow-200/50"
                                    : "bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:shadow-gray-800/50"
                                }
                            `}
                        >
                            {dark ? (
                                <SunIcon className="h-5 w-5" />
                            ) : (
                                <MoonIcon className="h-5 w-5" />
                            )}
                        </IconButton>
                    </div>
                </div>
            </Navbar>
        </div>
    );
}