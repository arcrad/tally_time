import { useState, useEffect, useRef } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'
import {TallyRecords} from './commonTypes';
import TallyList from './components/TallyList';
import RecordsDialog from './components/RecordsDialog';

function App() {
	const recordSelectDialogRef = useRef<HTMLDialogElement>(null);

	const [currentRecordIndex, setCurrentRecordIndex] = useState( () => {
		return parseInt(localStorage.getItem("currentRecordIndex") ?? '0');
	});
	const [tallyRecords, setTallyRecords] = useState<TallyRecords>( () => {
		let tallyRecordsLSV:string = localStorage.getItem("tallyRecords") ?? '{}';
		let parsedRecords = JSON.parse(tallyRecordsLSV);
		if(!Array.isArray(parsedRecords) || !(parsedRecords.length > 0)) {
			//console.warn('loading default starting tallyrecords');
			return ([{
				title: 'New Tally Record...',
				color: '#ff0000',
				tallySet: []
			}]);
		}
		if(tallyRecordsLSV !== null) {
		  let fixedRecords = parsedRecords.map( record => {
				return ({
					title: record.title,
					color: record.color,
					tallySet: record.tallySet.map( (item:string) => new Date(item))
				})
			});
			console.dir(fixedRecords);
			return fixedRecords;
		}
		//console.warn('got to loading empty tallyrecords');
		return [];
	});
	const [editRecordNameModeActive, setEditRecordNameModeActive] = useState(false);

	useEffect( () => {
			//console.warn('updating tallyRecords local storage');
			localStorage.setItem("tallyRecords", JSON.stringify(tallyRecords));
	}, [tallyRecords]);
	
	useEffect( () => {
			localStorage.setItem("currentRecordIndex", ''+currentRecordIndex);
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
		if(window.confirm('Are you sure? This will clear all current tallies in this record.')) {
			setTallyRecords( cs => {
				let newTallyRecords = structuredClone(cs);
				newTallyRecords[currentRecordIndex].tallySet = [];
				return newTallyRecords;
			});
		}
	}

	function createNewRecord() {
		setTallyRecords( cs => {
			return [
				...cs, 
				{
					title: `New Tally Record ${tallyRecords.length}`,
					color: '#ff0000',
					tallySet: []
				}
			]
		});
		setCurrentRecordIndex(tallyRecords.length);
		recordSelectDialogRef?.current?.close()
	};
	
	function deleteActiveRecord() {
		if(tallyRecords.length === 1) {
			alert('Must have at least one tally record.');
			return;
		}
		if(window.confirm('Are you sure? This will delete the current record.')) {
			setTallyRecords( cs => {
				let newTallyRecords = structuredClone(cs);
				newTallyRecords.splice(currentRecordIndex, 1);
				return newTallyRecords;
			});
			setCurrentRecordIndex( cs => cs - 1 > 0 ? cs - 1 : 0 );
		}
	};
	
	function updateRecordTitle(newTitle:string) {
		if(newTitle.length < 1) {
			return;
		}
		console.dir(`updateRecordTitle called newtitle=${newTitle}`);
		setTallyRecords( cs => {
			let newTallyRecords = structuredClone(cs);
			newTallyRecords[currentRecordIndex].title = newTitle;
			return newTallyRecords;
		});
	}

	let recordNameChangeInputDebounceId = 0;
	function handleRecordNameChange(input:string) {
		if(recordNameChangeInputDebounceId > 0) {
			window.clearTimeout(recordNameChangeInputDebounceId);
		}
		recordNameChangeInputDebounceId = window.setTimeout( () => {
			updateRecordTitle(input);
			recordNameChangeInputDebounceId = 0;
		}, 100);
	}

	function updateActiveRecord(recordIndex:number) {
		setCurrentRecordIndex(recordIndex);
		recordSelectDialogRef?.current?.close()
	};
 
	return (
    <>
			<div className="flex flex-col content-center items-center mb-10">
				<div className="w-3/4">
					<h1 className="text-3xl leading-loose text-center">Tally Time</h1>
					<div className="flex flex-row justify-center items-center">
					{ editRecordNameModeActive ? 
						<input 
							className="rounded-md my-1 ml-0 mr-1 border border-black text-lg px-2 py-1"
							type="text"
							onChange={ (e) => handleRecordNameChange(e.target.value)}
							defaultValue={tallyRecords[currentRecordIndex].title}
						/>
						:
						<button 
							className="my-1 ml-0 mr-1 text-lg font-bold rounded-md hover:bg-purple-100 text-black px-2 py-1"
							onClick={() => recordSelectDialogRef?.current?.showModal()}
						>
							{tallyRecords[currentRecordIndex].title}<span className="pl-2">▼</span>
						</button>
					}
					<button 
						className="m-1 text-lg rounded-md border-solid border-purple-200 border hover:bg-purple-100 text-gray-50 px-2 py-1"
						onClick={() => setEditRecordNameModeActive( cs => !cs)}
					>
					 { editRecordNameModeActive ? '❌ ' : '✏️ ' }	
					</button>
					<button 
						className="m-1 text-lg rounded-md border-solid border-purple-200 border hover:bg-purple-100 text-gray-50 px-2 py-1 disabled:opacity-30 disabled:hover:bg-white"
						onClick={deleteActiveRecord}
						disabled={tallyRecords.length === 1}
					>
					 🗑️ 	
					</button>
					</div>
					<p className="text-sm text-center mt-4 uppercase font-bold">Total Tallies</p>
					<p className="text-7xl text-center mb-4 leading-tight">{tallyRecords[currentRecordIndex].tallySet.length}</p>
					<div className="flex flex-row justify-center items-center">
					<button 
						className="m-1 rounded-md bg-purple-700 hover:bg-purple-900 text-gray-50 px-4 py-1"
						onClick={addTally}
					>
						<strong className="text-xl leading-none">+</strong> Add Tally
					</button>
					<button
						className="m-1 rounded-md bg-purple-700 hover:bg-purple-900 text-gray-50 px-4 py-1"
						onClick={resetTallySet}
					>
						Clear Tallies
					</button>
					</div>
				</div>
				<TallyList
					tallyRecords={tallyRecords}
					currentRecordIndex={currentRecordIndex}
				/>
			</div>
			<RecordsDialog
				dialogRef={recordSelectDialogRef}
				tallyRecords={tallyRecords}
				currentRecordIndex={currentRecordIndex}
				updateActiveRecord={updateActiveRecord}
				createNewRecord={createNewRecord}
			/>			
    </>
  )
}

export default App
