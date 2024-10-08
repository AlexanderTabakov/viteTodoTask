
import { createRoot } from 'react-dom/client'
import './index.css'
import MainPage from "./pages/MainPage.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import {ReactQueryDevtools} from "react-query/devtools";


const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(

    <QueryClientProvider client={queryClient}>
        <MainPage/>
        <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>

)
