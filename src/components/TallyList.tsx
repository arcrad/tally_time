import { TallyRecords } from '../commonTypes';

type TallyListProps = {
	tallyRecords: TallyRecords,
	currentRecordIndex: number,
	deleteTally: (tallyIndex:number) => void,
}

function TallyList({
	tallyRecords,
	currentRecordIndex,
	deleteTally,
}:TallyListProps) {
	return (
		<div className="mt-4 px-2 max-h-96 overflow-y-scroll">
			{
				tallyRecords && tallyRecords[currentRecordIndex] && tallyRecords[currentRecordIndex].tallySet.length === 0 ? 
					<span>No tallys yet...</span>
					:
					<ul className="tallyList divide-y-2">
						{ tallyRecords[currentRecordIndex].tallySet
								.map( (ts, i) => {
									return (
										<li 
											className="font-mono text-center text-sm sm:text-lg border-purple-200 py-2 px-2"
											key={i}
										>
											#{tallyRecords[currentRecordIndex].tallySet.length-i} @ {ts.toLocaleString()} <button onClick={() => deleteTally(i)}>❌</button>
										</li>
									)}
								)
						}
					</ul>
			}
		</div>
	);
}

export default TallyList;
