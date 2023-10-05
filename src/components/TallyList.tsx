import { TallyRecords } from "../commonTypes";

type TallyListProps = {
  tallyRecords: TallyRecords;
  currentRecordIndex: number;
  deleteTally: (tallyIndex: number) => void;
};

function TallyList({
  tallyRecords,
  currentRecordIndex,
  deleteTally,
}: TallyListProps) {
  return (
    <div className="mt-4 max-w-[26rem] overflow-y-scroll px-2">
      {tallyRecords &&
      tallyRecords[currentRecordIndex] &&
      tallyRecords[currentRecordIndex].tallySet.length === 0 ? (
        <span>No tallys yet...</span>
      ) : (
        <ul className="tallyList divide-y-2">
          {tallyRecords[currentRecordIndex].tallySet.map((ts, i) => {
            return (
              <li
                className="border-purple-200 px-2 py-2 text-center font-mono text-sm sm:text-lg"
                key={i}
              >
                #{tallyRecords[currentRecordIndex].tallySet.length - i} @{" "}
                {ts.toLocaleString()}{" "}
                <button onClick={() => deleteTally(i)}>❌</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default TallyList;
