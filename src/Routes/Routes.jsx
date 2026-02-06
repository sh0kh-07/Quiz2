import Home from "../Components/Home";
import Test from "../Components/Test";

export const Rout = [
    // {
    //     name: 'Home',
    //     path: '/',
    //     component: <Home />
    // },
    {
        name: 'Test',
        path: '/test/:id',
        component: <Test />
    },
]