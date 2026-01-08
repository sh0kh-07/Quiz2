import {
    Navbar,
    Typography,
} from "@material-tailwind/react";

export default function Footer() {

    const scrollToNextSection = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    return (
        <div className="w-full px-4 pb-[30px]">
            <Navbar
                className={`
                    mx-auto max-w-4xl rounded-full px-6 py-3 transition-all duration-300 bg-white/80 dark:bg-card-dark/80 backdrop-blur-lg shadow-xl border border-gray-200/30 dark:border-gray-700/30
                   
                `}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-[5px]">
                        <a className="text-[30px] text-black dark:text-text-dark" href="https://t.me/st_gargantua" target="_blank" rel="noopener noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19c-.14.75-.42 1-.68 1.03c-.58.05-1.02-.38-1.58-.75c-.88-.58-1.38-.94-2.23-1.5c-.99-.65-.35-1.01.22-1.59c.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02c-.09.02-1.49.95-4.22 2.79c-.4.27-.76.41-1.08.4c-.36-.01-1.04-.2-1.55-.37c-.63-.2-1.12-.31-1.08-.66c.02-.18.27-.36.74-.55c2.92-1.27 4.86-2.11 5.83-2.51c2.78-1.16 3.35-1.36 3.73-1.36c.08 0 .27.02.39.12c.1.08.13.19.14.27c-.01.06.01.24 0 .38" /></svg>
                        </a>
                        <a className="text-[30px] text-black dark:text-text-dark" href="https://t.me/shoxruh_tuxtanazarov" target="_blank" rel="noopener noreferrer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 512 512"><path fill="currentColor" d="M256 48C141.31 48 48 141.31 48 256s93.31 208 208 208s208-93.31 208-208S370.69 48 256 48m-50.22 116.82C218.45 151.39 236.28 144 256 144s37.39 7.44 50.11 20.94c12.89 13.68 19.16 32.06 17.68 51.82C320.83 256 290.43 288 256 288s-64.89-32-67.79-71.25c-1.47-19.92 4.79-38.36 17.57-51.93M256 432a175.5 175.5 0 0 1-126-53.22a122.9 122.9 0 0 1 35.14-33.44C190.63 329 222.89 320 256 320s65.37 9 90.83 25.34A122.9 122.9 0 0 1 382 378.78A175.45 175.45 0 0 1 256 432" /></svg>
                        </a>
                    </div>
                    <Typography
                        onClick={scrollToNextSection}
                        variant="h6"
                        className="font-bold text-text-light cursor-pointer dark:text-text-dark tracking-tight"
                    >
                        Wisdom
                    </Typography>
                </div>
            </Navbar>
        </div>
    );
}