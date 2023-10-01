import {TallySet, TallyRecord, TallyRecords} from './commonTypes';

type TallyListProps = {
	tallyRecords: TallyRecords,
	currentRecordIndex: number,
}

function TallyList({
	tallyRecords,
	currentRecordIndex
}:TallyListProps) {
	return (
		<div className="">
			{
				tallyRecords && tallyRecords[currentRecordIndex] && tallyRecords[currentRecordIndex].tallySet.length === 0 ? 
					<span>No tallys yet...</span>
					:
					<ul className="tallyList">
						{ tallyRecords[currentRecordIndex].tallySet
								.reverse()
								.map( (ts, i) => <li key={i}>
									#{tallyRecords[currentRecordIndex].tallySet.length-i} @ {ts.toLocaleString()}</li>
								)
						}
					</ul>
			}
		</div>
	);
}

export default TallyList;
