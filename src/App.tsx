import { useState, useEffect } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import './App.css'

type TallySet = Date[];

function App() {
  const [count, setCount] = useState(0)
	const [tallySet, setTallySet] = useState<TallySet>( () => {
		let tallySet:TallySet|null = localStorage.getItem("tallySet");
		if(tallySet !== null) {
		  return JSON.parse(tallySet).map( entry => new Date(entry) );
		}
		return [];
	});

	useEffect( () => {
			localStorage.setItem("tallySet", JSON.stringify(tallySet));
	}, [tallySet]);

	function addTally() {
		setTallySet( (cs) => {
			return [...cs, new Date()];
		});
	}
	
	function resetTallySet() {
		if(window.confirm('Are you sure? This will delete all current tallies.')) {
			setTallySet([]);
		}
	}

  return (
    <>
      <h1>Tally Time</h1>
			<h2>{tallySet.length}</h2>
      <div className="card">
        <button onClick={addTally}>
          Add Tally
        </button>
				<button onClick={resetTallySet}>
					Reset
				</button>
				<div className="tallyListContainer">
					{
						tallySet.length === 0 ? 
							<span>No tallys yet...</span>
							:
							<ul className="tallyList">
								{ tallySet
										.reverse()
										.map( (ts, i) => <li key={i}>
											#{tallySet.length-i} @ {ts.toLocaleString()}</li>
										)
								}
							</ul>
					}
				</div>
      </div>
    </>
  )
}

export default App
