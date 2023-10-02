import { forwardRef } from 'react';
import {TallySet, TallyRecord, TallyRecords} from './commonTypes';


type RecordsDialogProps = {
	tallyRecords: TallyRecords,
	currentRecordIndex: number,
	updateActiveRecord: (recordIndex:number) => void,
	createNewRecord: () => void
}

export type Ref = HTMLDialogElement;

const RecordsDialog = forwardRef<Ref, RecordsDialogProps>((props, recordSelectDialogRef) => {
	return (
		<dialog 
			className="p-4 rounded-xl backdrop:bg-purple-900 backdrop:bg-opacity-80"
			ref={recordSelectDialogRef}
		>
			<h1 className="text-sm uppercase font-bold px-2 py-2">Available Tally Records</h1>
			<ul>
				{
					props.tallyRecords.map( (record, i) => {
						return ( 
							<li
								className="text-lg leading-loose"
								style={{
									fontWeight: `${i == props.currentRecordIndex ? 'bold' : 'normal'}`
								}}
								key={i} 
							>
								<button
									className="w-full text-left rounded-md px-2 hover:bg-gray-200"
									onClick={() => { 
										props.updateActiveRecord(i)
									}}
								>
									{record.title}
								</button>
							</li> 
						)
					})
				}
			</ul>
			<div className="mt-2 space-x-2 flex flex-row justify-center items-center">
			<button 
				className="border border-green-500 text-lg px-2 py-1 rounded-md text-green-600 hover:bg-green-100"
				onClick={props.createNewRecord}
			>
			 + New Record
			</button>
				<button 
					className="border border-gray-600 text-lg px-2 py-1 rounded-md text-gray-700 hover:bg-gray-200"
					onClick={ () => recordSelectDialogRef.current.close()}
				>
					Close
				</button>
			</div>
		</dialog>
	);
});

export default RecordsDialog;
