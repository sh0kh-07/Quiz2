import Footer from "../UI/Footer";
import Header from "../UI/Header/Header";
import Hero from "./__components/Hero";
import Wisdom from "./__components/Wisdom";

export default function Home() {
    return (
        <>
            <div className="bg-background-light dark:bg-background-dark selection:transition-colors duration-500">
                <Header />
                <main>
                    <Hero />
                    <Wisdom />
                </main>
                <Footer />
            </div>
        </>
    )
}