import React, { useState } from "react";
import styled from "styled-components";
import { Button, Input, Modal, Select } from "antd";
import useStore from "../store";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";
import {postNewTodo} from "../pages/MainPage.tsx";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  .modal {
    display: flex;
    gap: 5px;
    column-gap: 10px;
    .textArea {
      gap: 10px;
    }
  }
`;

const AddToDoModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleChange = (value: string) => {
        setStatus(value);
    };

    // const { addTask } = useStore();

    const [taskTitle, seTaskTitle] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [status, setStatus] = useState("");

    const changeTaskTitle = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
        seTaskTitle((e.target as HTMLInputElement).value.trim());
    };

    const changeTaskDescription = (
        e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    ) => {
        setTaskDescription((e.target as HTMLInputElement).value.trim());
    };

    async function postNewTodo (newTodo:any) {
        await axios.post(`https://cms.laurence.host/api/tasks`, newTodo)
    }


    const queryClient = useQueryClient();


    const mutation = useMutation(newTodo=> postNewTodo(newTodo), {
        onSuccess:() => queryClient.invalidateQueries(['todos']),
    });



    const onSubmit = (e: Event) => {
        e.preventDefault();

        const newFormValue = {
            data: {
                name: taskTitle,
                description: taskDescription,
                status: status,
            },
        };

        // addTask(newFormValue);
        // @ts-ignore
        mutation.mutate(newFormValue)
        seTaskTitle("");
        setTaskDescription("");
    };

    return (
        <Container>
            <Button type="primary" onClick={showModal}>
                ADD TODO
            </Button>
            <Modal
                className={"modal"}
                style={{ gap: 10 }}
                title="Add TODO"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <Input
                    placeholder="Title"
                    type="text"
                    style={{ height: 50, marginBottom: 5 }}
                    onChange={changeTaskTitle}
                />

                <div className={"textArea"}>
                    <TextArea
                        onChange={changeTaskDescription}
                        placeholder={"Description"}
                        rows={4}
                    ></TextArea>
                </div>

                <Select
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={[
                        { value: "active", label: "Active" },
                        { value: "completed", label: "Completed" },
                    ]}
                />
                <Button type="primary" onClick={() => onSubmit(event)}>
                    ADD TODO
                </Button>
            </Modal>
        </Container>
    );
};

export default AddToDoModal;
