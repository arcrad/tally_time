import { useState, useEffect, useRef } from "react";
import { TallyRecords } from "./commonTypes";
import TallyList from "./components/TallyList";
import RecordsDialog from "./components/RecordsDialog";

function App() {
  const recordSelectDialogRef = useRef<HTMLDialogElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const [currentRecordIndex, setCurrentRecordIndex] = useState(() => {
    return parseInt(localStorage.getItem("currentRecordIndex") ?? "0");
  });
  const [tallyRecords, setTallyRecords] = useState<TallyRecords>(() => {
    let tallyRecordsLSV: string = localStorage.getItem("tallyRecords") ?? "{}";
    let parsedRecords = JSON.parse(tallyRecordsLSV);
    if (!Array.isArray(parsedRecords) || !(parsedRecords.length > 0)) {
      //console.warn('loading default starting tallyrecords');
      return [
        {
          title: "New Tally Record...",
          color: "#ff0000",
          tallySet: [],
        },
      ];
    }
    if (tallyRecordsLSV !== null) {
      let fixedRecords = parsedRecords.map((record) => {
        return {
          title: record.title,
          color: record.color,
          tallySet: record.tallySet.map((item: string) => new Date(item)),
        };
      });
      console.dir(fixedRecords);
      return fixedRecords;
    }
    //console.warn('got to loading empty tallyrecords');
    return [];
  });

  useEffect(() => {
    //console.warn('updating tallyRecords local storage');
    localStorage.setItem("tallyRecords", JSON.stringify(tallyRecords));
  }, [tallyRecords]);

  useEffect(() => {
    localStorage.setItem("currentRecordIndex", "" + currentRecordIndex);
  }, [currentRecordIndex]);

  function addTally() {
    setTallyRecords((cs) => {
      let newTallyRecords = structuredClone(cs);
      console.log("new tally records");
      console.dir(newTallyRecords);
      if (Array.isArray(newTallyRecords[currentRecordIndex].tallySet)) {
        console.log("PUSH new date");
        newTallyRecords[currentRecordIndex].tallySet.unshift(new Date());
      } else {
        console.log("CREATE new tallySet array");
        newTallyRecords[currentRecordIndex].tallySet = [new Date()];
      }
      return newTallyRecords;
    });
  }

  function resetTallySet() {
    if (
      window.confirm(
        "Are you sure? This will clear all current tallies in this record.",
      )
    ) {
      setTallyRecords((cs) => {
        let newTallyRecords = structuredClone(cs);
        newTallyRecords[currentRecordIndex].tallySet = [];
        return newTallyRecords;
      });
    }
  }

  function createNewRecord() {
    let newRecordTitle = `New Tally Record ${tallyRecords.length}`;
    setTallyRecords((cs) => {
      return [
        ...cs,
        {
          title: newRecordTitle,
          color: "#ff0000",
          tallySet: [],
        },
      ];
    });
    setCurrentRecordIndex(tallyRecords.length);
    if (renameInputRef.current !== null) {
      renameInputRef.current.value = newRecordTitle;
    }
    recordSelectDialogRef?.current?.close();
  }

  function deleteActiveRecord() {
    if (tallyRecords.length === 1) {
      alert("Must have at least one tally record.");
      return;
    }
    if (window.confirm("Are you sure? This will delete the current record.")) {
      let newRecordIndex =
        currentRecordIndex - 1 > 0 ? currentRecordIndex - 1 : 0;
      setTallyRecords((cs) => {
        let newTallyRecords = structuredClone(cs);
        newTallyRecords.splice(currentRecordIndex, 1);
        if (renameInputRef.current !== null) {
          renameInputRef.current.value = newTallyRecords[newRecordIndex].title;
        }
        return newTallyRecords;
      });
      setCurrentRecordIndex(newRecordIndex);
    }
  }

  function updateRecordTitle(newTitle: string) {
    if (newTitle.length < 1) {
      return;
    }
    //console.dir(`updateRecordTitle called newtitle=${newTitle}`);
    setTallyRecords((cs) => {
      let newTallyRecords = structuredClone(cs);
      newTallyRecords[currentRecordIndex].title = newTitle;
      return newTallyRecords;
    });
  }

  const recordNameChangeInputDebounceId = useRef(0);
  function handleRecordNameChange(input: string) {
    if (recordNameChangeInputDebounceId.current > 0) {
      window.clearTimeout(recordNameChangeInputDebounceId.current);
    }
    recordNameChangeInputDebounceId.current = window.setTimeout(() => {
      updateRecordTitle(input);
      recordNameChangeInputDebounceId.current = 0;
    }, 50);
  }

  function updateActiveRecord(recordIndex: number) {
    setCurrentRecordIndex(recordIndex);
    if (renameInputRef.current !== null) {
      renameInputRef.current.value = tallyRecords[recordIndex].title;
    }
    recordSelectDialogRef?.current?.close();
  }

  function deleteTally(tallyIndex: number) {
    if (window.confirm("Are you sure you want to delete this tally?")) {
      setTallyRecords((cs) => {
        let newTallyRecords = structuredClone(cs);
        newTallyRecords[currentRecordIndex].tallySet.splice(tallyIndex, 1);
        return newTallyRecords;
      });
    }
  }

  return (
    <>
      <div className="w-full flex flex-col justify-start content-start items-center mb-10">
        <div className="w-full sm:w-9/12 lg:w-1/2 flex flex-col justify-start content-start items-center">
          <h1 className="text-3xl leading-loose text-center">Tally Time ⏰</h1>
          <div className="w-full flex flex-row justify-center items-center">
            <div className="flex flex-row flex-nowrap w-3/4">
              <input
                ref={renameInputRef}
                className="flex-auto w-full rounded-md my-1 ml-1 mr-1 font-bold border border-white hover:border-purple-600 text-lg px-2 py-1"
                style={{
                  minWidth: "5rem",
                }}
                type="text"
                onChange={(e) => handleRecordNameChange(e.target.value)}
                onBlur={(e) => (e.target.scrollLeft = 0)}
                defaultValue={tallyRecords[currentRecordIndex].title}
              />
              <button
                className="m-1 text-lg rounded-md border-solid border-purple-600 border hover:bg-purple-100 text-purple-700 px-2 py-1 disabled:opacity-30 disabled:hover:bg-white"
                onClick={() => recordSelectDialogRef?.current?.showModal()}
              >
                ▼
              </button>
            </div>
            <button
              className="m-1 text-lg rounded-md border-solid border-purple-200 border hover:bg-purple-100 text-gray-50 px-2 py-1 disabled:opacity-30 disabled:hover:bg-white"
              onClick={deleteActiveRecord}
              disabled={tallyRecords.length === 1}
            >
              🗑️
            </button>
          </div>
          <p className="text-sm text-center mt-4 uppercase font-bold">
            Total Tallies
          </p>
          <p className="text-7xl text-center mb-4 leading-tight">
            {tallyRecords[currentRecordIndex].tallySet.length}
          </p>
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
          <TallyList
            tallyRecords={tallyRecords}
            currentRecordIndex={currentRecordIndex}
            deleteTally={deleteTally}
          />
        </div>
      </div>
      <RecordsDialog
        dialogRef={recordSelectDialogRef}
        tallyRecords={tallyRecords}
        currentRecordIndex={currentRecordIndex}
        updateActiveRecord={updateActiveRecord}
        createNewRecord={createNewRecord}
      />
    </>
  );
}

export default App;
