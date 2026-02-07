import ErrorPage from "../Components/ErrorPage/ErrorPage";
import Home from "../Components/Home";
import Test from "../Components/Test";

export const Rout = [
    {
        name: 'Home',
        path: '/',
        component: <ErrorPage />
    },
    {
        name: 'Test',
        path: '/test/:id',
        component: <Test />
    },
]