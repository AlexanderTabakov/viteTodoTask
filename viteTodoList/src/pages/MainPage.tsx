import useStore from "../store";
import TodoCard from "../components/TodoCard.tsx";
import AddToDoModal from "../components/AddTodoModal.tsx";
import {useMutation, useQuery, useQueryClient} from "react-query";
import axios from "axios";
import {Spin} from "antd";


import styled from "styled-components";
import {a} from "vite/dist/node/types.d-aGj9QkWt";

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



async function fetchTodos () {
    return (await axios.get(`https://cms.laurence.host/api/tasks`))
        .data.data;
}




const MainPage = () => {

    const {addToFavorite, removeFromFavorite, favoriteTodo} = useStore();


    const {data, isLoading, isError} = useQuery('todos', fetchTodos, {keepPreviousData:true});


    const queryClient = useQueryClient();



    async function deleteTodo(id: any) {
        const response = await axios.delete(`https://cms.laurence.host/api/tasks/${id}`);
        return response.data;
    }

    const mutation = useMutation(id => deleteTodo(id), {

        onSuccess:  () =>  queryClient.invalidateQueries(['todos'],)

    });


    const testDelete = (id:any) => {
        mutation.mutate(id)
    }



    // async function updateStatus(id: any, item:any) {
    //     // const { name, description, status } = item;
    //     // const test = { data: { name, description, status } };
    //     console.log('item', item)
    //     const response = await axios.put(`https://cms.laurence.host/api/tasks/${id}`,
    //         {item}
    //     );
    //
    //     console.log('item', item)
    //
    //     return response.data;
    //
    // }


    async function updateStatus(id: any, item: any) {
        const { name, description, status } = item?.attributes;


        const requestBody = {
            data: {
                name,
                description,
                status,
            },
        };

        const response = await axios.put(`https://cms.laurence.host/api/tasks/${id}`, requestBody);
        return response.data;
    }



    const mutationUpdateStatus = useMutation((id, item ) => updateStatus(id , item ), {
        onSuccess: () => queryClient.invalidateQueries(['todos']),
    });

    const testUpdate = (id:any, item:any) => {
        mutationUpdateStatus.mutate(id, item)
        // console.log('putting update status')
    }


    const anotherTestUpdate = (id:any, item:any) => {


        const { status } = item?.attributes;

        if (status === 'completed') {
            item.attributes.status = 'active';
        } else if (status === 'active') {
            item.attributes.status = 'completed'
        }


        updateStatus(id, item);
    }







    // console.log('testData',data)


    // if (isLoading) {
    //     return <div>Loading...</div>;
    //
    // }

        // if (isLoading) {
        //     return <Spin/>
        // }

    if (isError) {
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
                        // changeStatus={() => updateStatus(item.id, item)}
                        changeStatus={() => anotherTestUpdate(item.id, item)}
                        // changeStatus={() => testUpdate(item.id, item)}
                        // changeStatus={(newStatus) => mutationUpdateStatus.mutate(item.id, newStatus)}
                    />
                ))}
            </div>

        </Container>



    );
};

export default MainPage;
