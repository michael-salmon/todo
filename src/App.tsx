import {
	useEffect,
	useState,
	type ChangeEvent,
	type KeyboardEvent
} from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { type todoItem } from './types';
import './App.css';
import { Button } from './frags/Button';
import { Spacer } from './frags/Spacer';

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
			<Spacer />
			<input
				className='border-2 border-white rounded'
				type='text'
				value={newTodo}
				onChange={handleTodoUpdate}
				onKeyDown={onEnter}
				placeholder=' New Task...' />
			<Button
				onClick={handleOnClick}
				disabled={!newTodo.length}>
				Add ➕
			</Button>
			<Button onClick={handleOnClear} disabled={!doneLength}>Clear Done ➖</Button>
			<Spacer />
			<div className='flex flex-wrap gap-1'>
				{todoList.map((x, i) => (
					<div key={i + x.task} className={`max-w-xs p-6 bg-white border border-gray-200 rounded-lg shadow-sm ${x.isDone ? "dark:bg-green-700 dark:border-green-600" : "dark:bg-gray-800 dark:border-gray-700"} overflow-x-auto`}>
						<div>
							<Button title={!x.isDone ? `Check` : 'Uncheck'} onClick={handleOnCheck(i)}>
								{x.isDone ? `✅` : `🔳`}
							</Button>
							<Button title='Remove' onClick={handleOnDelete(i)}>
								🗑️
							</Button>
						</div>
						<Spacer />
						<span
							className={`text-wrap m-2 ${x.isDone ? "line-through" : ""}`}
							onClick={handleOnCheck(i)}>
							{x.task}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default App;
