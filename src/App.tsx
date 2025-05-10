import { Fragment, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import './App.css';

function App() {
	const [toDos, setTodos] = useState<string[]>([]);
	const [newTodo, setNewTodo] = useState('');
	const [done, setDone] = useState<boolean[]>([]);

	const handleTodoUpdate = (event: ChangeEvent<HTMLInputElement>) => {
		const { target: { value } } = event;
		setNewTodo(value);
	}
	
	const handleOnCheck = (index: number) => () => {
		setDone(prev => {
			const temp = [...prev];
			temp[index] = !prev[index];
			return temp;
		})
	}
	
	const handleOnClick = () => {
		setTodos(prev => [...prev, newTodo]);
		setDone(prev => [...prev, false]);
		setNewTodo('');
	}

	const handleOnDelete = (index: number) => () => {
		setTodos(prev =>  prev.toSpliced(index, 1));
		setDone(prev => prev.toSpliced(index, 1));
	}

	const onEnter = ({ code }: KeyboardEvent<HTMLInputElement>) => {
		if (code === 'Enter') handleOnClick();
	}

	return (
		<>
			<div>
				<input type='text' value={newTodo} onChange={handleTodoUpdate} onKeyDown={onEnter} />
				<button onClick={handleOnClick} disabled={!newTodo.length}>Add ➕</button>
				<div>
					{toDos.map((x, i) => (
						<Fragment key={x+i}>
							<input type='checkbox' onClick={handleOnCheck(i)} />
							<text style={done[i] ? { textDecoration: 'line-through' } : {}}>{x}</text>
							<button onClick={handleOnDelete(i)}>🗑️</button>
						</Fragment>
					))}
				</div>
			</div>
		</>
	)
}

export default App
