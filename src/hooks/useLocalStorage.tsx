import type { todoItem } from "../types";

export const useLocalStorage = () => {
    const setStorage = (todoList: todoItem[]) => {        
        window.localStorage.setItem('todo', JSON.stringify(todoList));
    }

    return {
        setStorage
    }
}