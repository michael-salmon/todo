import {
	useEffect,
	useState,
	type ChangeEvent,
	type KeyboardEvent
} from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { type todoItem } from './types';
import './App.css';

function App() {
	const { setStorage } = useLocalStorage();
	const [todoList, setTodoList] = useState<todoItem[]>([]);
	const [newTodo, setNewTodo] = useState('');

	useEffect(function loadTodoList() {
		const todo = window.localStorage.getItem('todo');
		if (todo) {
			const parsed = JSON.parse(todo ?? "");
			if (parsed.length) {
				setTodoList(parsed);
			}
		}
	}, []);

	useEffect(function saveTodoList() {
		setStorage(todoList);
	}, [todoList]);

	const handleTodoUpdate = (event: ChangeEvent<HTMLInputElement>) => {
		const { target: { value } } = event;
		setNewTodo(value);
	}

	const handleOnCheck = (index: number) => () => {
		setTodoList(prev => prev.map((x, i) => i === index
			? { isDone: !x.isDone, task: x.task }
			: x
		));
	}

	const handleOnClick = () => {
		setTodoList(prev => [...prev, {
			isDone: false,
			task: newTodo
		}]);
		setNewTodo('');
	}

	const handleOnClear = () => {
		setTodoList(prev => prev.filter(x => !x.isDone));
	}

	const handleOnDelete = (index: number) => () => {
		setTodoList(prev => prev.toSpliced(index, 1));
	}

	const onEnter = ({ code }: KeyboardEvent<HTMLInputElement>) => {
		if (code === 'Enter') handleOnClick();
	}

	const { length: doneLength } = todoList.filter(x => x.isDone);
	const { length: totalLength } = todoList;
	const todoCount = `${doneLength} / ${totalLength}${doneLength === totalLength && !!totalLength ? ` 🎉` : ''}`

	return (
		<div>
			<h4 className="text-3xl font-bold underline text-center">to-do list | {todoCount}</h4>
			<input
				className='border-2 border-white rounded'
				type='text'
				value={newTodo}
				onChange={handleTodoUpdate}
				onKeyDown={onEnter}
				placeholder=' New Task...' />
			<button className='mx-2 disabled:bg-gray-500 disabled:cursor-not-allowed'
				onClick={handleOnClick}
				disabled={!newTodo.length}>
				Add ➕
			</button>
			<button onClick={handleOnClear} disabled={!doneLength}>Clear Done ➖</button>
			<div className='my-2' />
			<div className='flex flex-wrap gap-1'>
				{todoList.map((x, i) => (
					<div key={i + x.task} className={"max-w-xs p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"}>
						<span
							className={`text-wrap m-2 ${x.isDone ? "line-through" : ""}`}
							onClick={handleOnCheck(i)}>
							{x.task}
						</span>
						<div>
							<button title={!x.isDone ? `Check` : 'Uncheck'} onClick={handleOnCheck(i)}>
								{x.isDone ? `✅` : `🔳`}
							</button>
							<button title='Remove' className='mx-2' onClick={handleOnDelete(i)}>
								🗑️
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default App
