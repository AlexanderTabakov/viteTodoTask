import React from "react";
import { Button, Card, Select } from "antd";
import { IItem } from "../store";
import styled from "styled-components";

interface IProps extends IItem {
    id?: number;
    addToFav?: () => void;
    removeFromFav?: () => void;
    deleteTodo?: () => void;
    changeStatus?: () => void;
}

const Container = styled.div`
  display: flex;
  width: 100%;
  margin: 15px 0 15px 0;
`;

const TodoCard: React.FC<IProps> = ({
                                        title,
                                        status,
                                        description,
                                        addToFav,
                                        removeFromFav,
                                        deleteTodo,
                                        changeStatus,
                                    }) => {
    return (
        <Container>
            <Card hoverable>
                <Button type="default" onClick={addToFav}>
                    Add To Favorite
                </Button>
                <Button type="dashed" onClick={removeFromFav}>
                    Remove From Favorite
                </Button>
                <Button
                    style={{ backgroundColor: "red" }}
                    type="primary"
                    onClick={deleteTodo}
                >
                    Delete TODO
                </Button>

                <p>{title}</p>
                <p>{description}</p>
                <p>{status}</p>
                <Select
                    placeholder={status}
                    onChange={changeStatus}
                    options={[
                        { value: "active", label: "Active" },
                        { value: "completed", label: "Completed" },
                    ]}
                ></Select>
            </Card>
        </Container>
    );
};

export default TodoCard;
