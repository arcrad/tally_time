import { TallyRecords } from '../commonTypes';

type TallyListProps = {
	tallyRecords: TallyRecords,
	currentRecordIndex: number,
}

function TallyList({
	tallyRecords,
	currentRecordIndex
}:TallyListProps) {
	return (
		<div className="mt-4 px-2 max-h-96 overflow-y-scroll">
			{
				tallyRecords && tallyRecords[currentRecordIndex] && tallyRecords[currentRecordIndex].tallySet.length === 0 ? 
					<span>No tallys yet...</span>
					:
					<ul className="tallyList divide-y-2">
						{ tallyRecords[currentRecordIndex].tallySet
								.reverse()
								.map( (ts, i) => {
									return (
										<li 
											className="font-mono text-center text-lg border-purple-200 py-1 px-10"
											key={i}
										>
											#{tallyRecords[currentRecordIndex].tallySet.length-i} @ {ts.toLocaleString()}
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
