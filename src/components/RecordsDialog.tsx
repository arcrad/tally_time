import { RefObject } from "react";
import { TallyRecords } from "../commonTypes";

type RecordsDialogProps = {
  dialogRef: RefObject<HTMLDialogElement>;
  tallyRecords: TallyRecords;
  currentRecordIndex: number;
  updateActiveRecord: (recordIndex: number) => void;
  createNewRecord: () => void;
};

function RecordsDialog({
  dialogRef,
  tallyRecords,
  currentRecordIndex,
  updateActiveRecord,
  createNewRecord,
}: RecordsDialogProps) {
  if (dialogRef === null) {
    return <p>No dialogRef given.</p>;
  }
  return (
    <dialog
      className="rounded-xl p-4 backdrop:bg-purple-900 backdrop:bg-opacity-80"
      ref={dialogRef}
    >
      <h1 className="px-2 py-2 text-sm font-bold uppercase">
        Available Tally Records
      </h1>
      <ul className="divide-y">
        {tallyRecords.map((record, i) => {
          return (
            <li
              className={`border-gray-300 text-lg leading-loose ${
                i == currentRecordIndex ? "font-bold" : ""
              }`}
              key={i}
            >
              <button
                className="w-full px-2 text-left hover:bg-gray-200"
                onClick={() => {
                  updateActiveRecord(i);
                }}
              >
                {record.title}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 flex flex-row items-center justify-center space-x-2">
        <button
          className="rounded-md border border-green-500 px-2 py-1 text-lg text-green-600 hover:bg-green-100"
          onClick={createNewRecord}
        >
          + New Record
        </button>
        <button
          className="rounded-md border border-gray-600 px-2 py-1 text-lg text-gray-700 hover:bg-gray-200"
          onClick={() => dialogRef?.current?.close()}
        >
          Close
        </button>
      </div>
    </dialog>
  );
}

export default RecordsDialog;
