import useStore from "../store";
import TodoCard from "../components/TodoCard.tsx";
import AddToDoModal from "../components/AddTodoModal.tsx";
import {useMutation, useQuery, useQueryClient} from "react-query";
import axios from "axios";
import {Spin} from "antd";


import styled from "styled-components";

const Container = styled.main`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  padding: 30px 60px 30px 60px;
    

  .btns {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .spinner {
    position: fixed;
    z-index: 99;
    top: 50%;
    left: 50%;
  }
`;

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

    const {addToFavorite, removeFromFavorite, favoriteTodo} = useStore();


    const {data, isLoading, isError} = useQuery('todos', fetchTodos, {keepPreviousData:true});


    const queryClient = useQueryClient();

    // async function deleteTodo (id:any) {
    //     await axios.delete(`https://cms.laurence.host/api/tasks/${id}`, )
    // }


    async function deleteTodo(id: any) {
        const response = await axios.delete(`https://cms.laurence.host/api/tasks/${id}`);
        return response.data;
    }

    const mutation = useMutation(id => deleteTodo(id), {
        // onSettled: async () => await queryClient.invalidateQueries(['todos'], {}),


        onSuccess:  () =>  queryClient.invalidateQueries(['todos'],),


    });


    const testDelete = (id:any) => {
        mutation.mutate(id)
    }



    // mutation.mutate(id)



    //TODO разобраться с перерисовкой страницы


    // const mutation = useMutation(newTodo=> postNewTodo(newTodo));

    // mutation.mutate()

    console.log('testData',data)


    // if (isLoading) {
    //     return <div>Loading...</div>;
    //
    // }

        // if (isLoading) {
        //     return <Spin/>
        // }

    if(isError) {
        return <div>Error =( </div>;
    }





    return (


        <Container>


            <div>

                <div>{` Избранных тудушек   ${favoriteTodo?.length}`}</div>
            </div>

            <h1>TEST</h1>
                        <AddToDoModal/>
            {/*{isLoading && <Spin/>}*/}

            <div>
                {isLoading && <Spin className={"spinner"} />}
                {data?.map((item: any) => (
                    <TodoCard
                        key={item.id}
                        title={item.attributes.name}
                        description={item.attributes.description}
                        status={item.attributes.status}
                        addToFav={() => addToFavorite(item)}
                        removeFromFav={() => removeFromFavorite(item.id)}
                        deleteTodo={() => testDelete(item.id)}
                        // changeStatus={() => changeStatus(item.id, item.attributes.status)}
                    />
                ))}
            </div>

        </Container>



    );
};

export default MainPage;
