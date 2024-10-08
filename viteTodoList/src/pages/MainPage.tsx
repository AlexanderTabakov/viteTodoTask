import useStore from "../store";
import TodoCard from "../components/TodoCard.tsx";
import AddToDoModal from "../components/AddTodoModal.tsx";
import {useMutation, useQuery} from "react-query";
import axios from "axios";
// import {data} from "../queries.ts";


// async function fetchTodos () {
//     const {data} = await axios.get(
//         `https://cms.laurence.host/api/tasks`
//     )
//     return data.data;
//
// }


async function fetchTodos () {
    return (await axios.get(`https://cms.laurence.host/api/tasks`))
        .data.data;
}

// export async function postNewTodo (newTodo:any) {
//    await axios.post(`https://cms.dev-land.host/api/tasks`, newTodo)
// }


const MainPage = () => {

    const {addToFavorite, removeFromFavorite} = useStore();

    const {data} = useQuery('todos', fetchTodos);

    // const mutation = useMutation(newTodo=> postNewTodo(newTodo));

    // mutation.mutate()

    console.log('testData',data)



    return (
        <div>

            <h1>TEST</h1>

            <AddToDoModal/>


            <div>
                {data?.map((item: any) => (
                    <TodoCard
                        key={item.id}
                        title={item.attributes.name}
                        description={item.attributes.description}
                        status={item.attributes.status}
                        addToFav={() => addToFavorite(item)}
                        removeFromFav={() => removeFromFavorite(item.id)}
                        // deleteTodo={() => deleteTodo(item.id)}
                        // changeStatus={() => changeStatus(item.id, item.attributes.status)}
                    />
                ))}
            </div>


        </div>
    );
};

export default MainPage;
