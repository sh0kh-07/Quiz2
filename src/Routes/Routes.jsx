import Home from "../Components/Home";
import Module from "../Components/Module";
import Test from "../Components/Test";
import Theme from "../Components/Theme";

export const Rout = [
    {
        name: 'Home',
        path: '/',
        component: <Home />
    },
    {
        name: 'Them',
        path: '/module/:id',
        component: <Module />
    },
    {
        name: 'Question',
        path: '/theme/:id',
        component: <Test />
    },
]