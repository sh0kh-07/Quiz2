import Home from "../Components/Home";
import Module from "../Components/Module";
import Test from "../Components/Test";
import Part from "../Components/Part";
import UserPart from "../Components/UserPart";

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
        name: 'Part',
        path: '/parts/:id',
        component: <UserPart />
    },
    {
        name: 'Question',
        path: '/theme/:id',
        component: <Test />
    },

]