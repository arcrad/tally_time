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
		<dialog ref={recordSelectDialogRef}>
			<button onClick={ () => recordSelectDialogRef.current.close()}>
				Close Modal
			</button>
			<ul>
				{
					props.tallyRecords.map( (record, i) => {
						return ( 
							<li
								style={{
									fontWeight: `${i == props.currentRecordIndex ? 'bold' : 'normal'}`
								}}
								key={i} 
								onClick={() => { 
									props.updateActiveRecord(i)
								}}
							>{record.title}</li> 
						)
					})
				}
			</ul>
			<button onClick={props.createNewRecord}>+++ New Record</button>
		</dialog>
	);
});

export default RecordsDialog;
