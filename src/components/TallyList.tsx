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
    <div
      className="mt-4 max-h-96 max-w-[26rem] overflow-y-scroll px-2 pb-20"
      style={{
        mask: "linear-gradient(to bottom, rgba(0,0,0, 1) 0, rgba(0,0,0, 1) 75%, rgba(0,0,0, 0) 95%, rgba(0,0,0, 0) 0) 100% 50% / 100% 100% repeat-x",
      }}
    >
      {tallyRecords &&
      tallyRecords[currentRecordIndex] &&
      tallyRecords[currentRecordIndex].tallySet.length === 0 ? (
        <p className="py-2 text-center text-lg leading-loose">
          No tallys yet. <br />
          Click{" "}
          <span className="mx-1 rounded border border-gray-900 px-2 py-1 text-base font-bold text-gray-900">
            + Add Tally
          </span>{" "}
          above to start.
        </p>
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
