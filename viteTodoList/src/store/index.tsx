import { create } from "zustand";
import { devtools, persist, PersistOptions } from "zustand/middleware";
import axios from "axios";

export interface IData {
    id: number;
    attributes: IItem;
}
export interface IItem {
    id?: number;
    title: string;
    description: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
}

export interface IState {
    data: IData[];
    loading: boolean;
    hasErrors: boolean;
    getData?: () => Promise<void>;
    // addTask?: (newTodo: IItem) => Promise<void>;
    addTask?: any;
    sortByActive?: () => void;
    sortByCompleted?: () => void;
    reset?: () => void;
    copiedData: any;
    copyData: () => void;
    favoriteTodos: IItem[];
    // addToFavorite?:(newTodo: IItem) => void;
    addToFavorite?: any;
    removeFromFavorite?: (id: number) => void;
    sortByFav?: () => void;
    // sortByFav?:any,
    deleteTodo?: (id: number) => void;
    changeStatus?: (id: number, item: IItem) => Promise<void>;
    nextPage?: number;
    changePage?: () => void;
    prevPage: () => void;
    resetPage: () => void;
    onSet?: (state: IState) => void;
}

const useStore = create(
    persist(
        devtools<IState>((set, get) => ({
            data: [],
            copiedData: [],
            favoriteTodos: [],
            loading: false,
            hasErrors: false,
            nextPage: 0,

            changePage: () => {
                const plus1 = get().nextPage + 1;
                set({ nextPage: plus1 });
            },

            prevPage: () => {
                const minus1 = get().nextPage - 1;
                set({ nextPage: minus1 });
            },

            resetPage: () => {
                const reset = (get().nextPage = 0);
                set({ nextPage: reset });
            },

            getData: async () => {
                set(() => ({ loading: true }));
                try {
                    const nextPage = get().nextPage;
                    const response = await axios.get(
                        `https://cms.dev-land.host/api/tasks?pagination%5BwithCount%5D=true&pagination%5Bpage%5D=${nextPage}`,
                    );

                    set((state: IState) => ({
                        data: (state.data = response.data.data),
                        loading: false,
                        // nextPage: state.nextPage + 1,
                    }));
                } catch (err) {
                    console.log(err);
                    set(() => ({ hasErrors: true, loading: false }));
                }
            },

            deleteTodo: async (id: number) => {
                set(() => ({ loading: true }));
                try {
                    const response = await axios.delete(
                        `https://cms.dev-land.host/api/tasks/${id}`,
                    );
                } catch (err) {
                    console.log(err);
                    set(() => ({ hasErrors: true, loading: false }));
                }
            },

            changeStatus: async (id: number, item: IItem) => {
                const { title, description, status } = item;
                const test = { data: { title, description, status } };
                // set(() => ({ loading: true }));
                try {
                    const response = await axios.put(
                        `https://cms.dev-land.host/api/tasks/${id}`,
                        test,
                    );
                } catch (err) {
                    console.log(err);
                    set(() => ({ hasErrors: true, loading: false }));
                }
            },

            copyData: () => {
                set((state: IState) => ({ copiedData: state.data }));
            },

            sortByActive() {
                const sortByActive = get().data.filter(
                    (a) => a.attributes.status === "active",
                );
                set({ copiedData: sortByActive });
            },

            sortByCompleted() {
                const sortCompleted = get().data.filter(
                    (a) => a.attributes.status === "completed",
                );
                set({ copiedData: sortCompleted });
            },

            sortByFav() {
                const sortByFavTest = [...get().favoriteTodos];
                set({ copiedData: sortByFavTest });
            },

            reset: () => {
                get().getData();
                set((state: IState) => ({ copiedData: state.data }));
            },

            addTask: async (newTodo: IItem) => {
                // set(() => ({ loading: true }));

                try {
                    const response = await axios.post(
                        "https://cms.dev-land.host/api/tasks",
                        newTodo,
                    );
                } catch (err) {
                    set(() => ({ hasErrors: true, loading: false }));
                }
            },

            addToFavorite(newTodo: IItem) {
                const favTest = [...get().favoriteTodos, newTodo];
                set({ favoriteTodos: favTest });
            },

            removeFromFavorite(id: number) {
                const removeFav = [...get().favoriteTodos.filter((t) => t.id !== id)];
                set({ favoriteTodos: removeFav });
            },

            onSet: (state: IState) => {
                localStorage.setItem("todos-storage", JSON.stringify(state));
            },
        })),
        {
            key: "todoTasks",
            name: "todos-storage",
            getStorage: () => sessionStorage,

            blackList: ["data", "copiedData"],

            // partialize: (state:IState) => ({
            //     test: state.favoriteTodos,
            //     // test2:state.copiedData,
            //     // test3: state.addToFavorite,
            //     // test4: state.sortByFav,
            //     // test5: state.removeFromFavorite,
            //     // test6: state.data
            //     // test7:state.nextPage
            // }),
        } as PersistOptions<any> & { blackList: string[] },
    ),
);

// useStore.getState().getData();
// useStore.getState().copyData();

export default useStore;
