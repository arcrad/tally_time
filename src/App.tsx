import { useState, useEffect, useRef } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import {TallySet, TallyRecord, TallyRecords} from './commonTypes';
import TallyList from './components/TallyList';

function App() {
	const recordSelectDialogRef = useRef<HTMLDialogElement>();

  const [count, setCount] = useState(0)
	const [currentRecordIndex, setCurrentRecordIndex] = useState( () => {
		return localStorage.getItem("currentRecordIndex") || 0;
	});
	const [tallyRecords, setTallyRecords] = useState<TallyRecord>( () => {
		let tallyRecords:TallyRecords|null = localStorage.getItem("tallyRecords");
		let parsedRecords = JSON.parse(tallyRecords);
		if(!Array.isArray(parsedRecords) || !parsedRecords.length > 0) {
			console.warn('loading default starting tallyrecords');
			return ([{
				title: 'New Tally Record...',
				color: '#ff0000',
				tallySet: []
			}]);
		}
		if(tallyRecords !== null) {
		  let fixedRecords = parsedRecords.map( record => {
				return ({
					title: record.title,
					color: record.color,
					tallySet: record.tallySet.map( item => new Date(item) )
				})
			});
			console.dir(fixedRecords);
			return fixedRecords;
		}
		console.warn('got to loading empty tallyrecords');
		return [];
	});

	useEffect( () => {
			console.warn('updating tallyRecords local storage');
			localStorage.setItem("tallyRecords", JSON.stringify(tallyRecords));
	}, [tallyRecords]);
	
	useEffect( () => {
			localStorage.setItem("currentRecordIndex", currentRecordIndex);
	}, [currentRecordIndex]);

	function addTally() {
		setTallyRecords( (cs) => {
			let newTallyRecords = structuredClone(cs);
			console.log('new tally records');
			console.dir(newTallyRecords);
			if(
				Array.isArray(newTallyRecords[currentRecordIndex].tallySet)
			) {
				console.log('PUSH new date');
				newTallyRecords[currentRecordIndex].tallySet.push(new Date());
			} else {
				console.log('CREATE new tallySet array');
				newTallyRecords[currentRecordIndex].tallySet = [new Date()];
			}
			return newTallyRecords;
		});
	}
	
	function resetTallySet() {
		if(window.confirm('Are you sure? This will delete all current tallies.')) {
		}
	}

	function createNewRecord() {
		setTallyRecords( cs => {
			return [
				...cs, 
				{
					title: `New Tally Record ${Math.floor(Math.random()*1000)}`,
					color: '#ff0000',
					tallySet: []
				}
			]
		});
		setCurrentRecordIndex(tallyRecords.length);
		recordSelectDialogRef.current.close()
	};
  
	return (
    <>
			<div className="flex flex-col content-center items-center h-screen border border-black border-solid p-2">
				<div className="border border-red-600 w-3/4">
					<h1 className="text-4xl">Tally Time</h1>
					<button 
						className="m-1 rounded-md bg-purple-700 hover:bg-purple-900 text-gray-50 p-2"
						onClick={addTally}
					>
						Rename
					</button>
					<p>Title = {tallyRecords[currentRecordIndex].title}</p>
					<button 
						className="m-1 rounded-md bg-purple-700 hover:bg-purple-900 text-gray-50 p-2"
						onClick={() => recordSelectDialogRef.current.showModal()}
					>
						Change
					</button>
					<h2>{tallyRecords[currentRecordIndex].tallySet.length}</h2>
					<button 
						className="m-1 rounded-md bg-purple-700 hover:bg-purple-900 text-gray-50 p-2"
						onClick={addTally}
					>
						Add Tally
					</button>
					<button
						className="m-1 rounded-md bg-purple-700 hover:bg-purple-900 text-gray-50 p-2"
						onClick={resetTallySet}
					>
						Reset
					</button>
				</div>
				<TallyList
					tallyRecords={tallyRecords}
					currentRecordIndex={currentRecordIndex}
				/>
			</div>
			{ 
				<dialog ref={recordSelectDialogRef}>
					<button onClick={ () => recordSelectDialogRef.current.close()}>
						Close Modal
					</button>
					<ul>
						{
							tallyRecords.map( (record, i) => {
								return ( 
									<li
										style={{
											fontWeight: `${i == currentRecordIndex ? 'bold' : 'normal'}`
										}}
									  key={i} 
										onClick={() => { 
											setCurrentRecordIndex(i);
											recordSelectDialogRef.current.close()
										}}
									>{record.title}</li> 
								)
							})
						}
					</ul>
					<button onClick={createNewRecord}>+New Record</button>
				</dialog>
			}
    </>
  )
}

export default App
