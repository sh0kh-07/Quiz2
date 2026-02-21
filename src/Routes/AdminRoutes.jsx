import Dashboard from "../Components/Dashboard";
import Payment from "../Components/Payment";
import Create from "../Components/Question/Create";
import QuizDetail from "../Components/QuizDetail";
import Reklama from "../Components/Reklama";
import Topic from "../Components/Topic";
import TopicDetail from "../Components/TopicDetail";
import TopicModule from "../Components/TopicModule";

export const AdminRoutes = [
    {
        name: 'Dashboard',
        path: '/dashboard',
        component: <Dashboard />
    },
    {
        name: 'Topic module',
        path: '/topic-modules',
        component: <TopicModule />
    },
    {
        name: 'Topic module detail',
        path: '/topic-modules/:id',
        component: <Topic />
    },
    {
        name: 'Topic detail',
        path: '/topic/:id',
        component: <TopicDetail />
    },
    {
        name: 'Question yaratish',
        path: '/question/create/:id',
        component: <Create />
    },
    {
        name: 'Payment',
        path: '/payment',
        component: <Payment />
    },
    {
        name: 'Reklama',
        path: 'reklama',
        component: <Reklama />
    },
]