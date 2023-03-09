import logo from "./logo.svg";
import images from "./USA.json";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { app } from "./firebase";
import { getDatabase, ref, set, onValue } from "firebase/database";

const SectionContainer = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	max-width: 100vw;
	overflow-x: hidden;
	min-height: 100vh;
`;

const GameContainer = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	max-width: 100vw;
	overflow-x: hidden;
`;

const ImgContainer = styled.div`
	height: 50vh;
	width: 60vw;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const CenterImage = styled.img`
	object-fit: contain;
	max-width: 100%;
	max-height: 100%;
`;

const GuessContainer = styled.div`
	width: 90%;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

const YearInput = styled.input`
	width: 50%;
	transform: scale(2);
	transform-origin: 50% 0;
`;

const GuessButton = styled.button`
	margin: 2vw;
	width: 20%;
`;

const YearDatalist = styled.datalist`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	writing-mode: vertical-lr;
	width: 100%;
`;

const ResultsContainer = styled.div`
	width: 100%;
	height: 100vh;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
`;

const HistogramContainer = styled.div`
	width: 90%;
	height: 20vh;
	display: flex;
	align-items: flex-end;
	border-bottom: 1px solid;
`;

const Bar = styled.div`
	flex-grow: 1;
	background-color: blue;
`;

const HistogramYearContainer = styled.div`
	width: 90%;
	height: 10vh;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
`;

function rangeArray(start, end, mod) {
	if (start > end) {
		return [];
	}
	let arr = [];
	for (let i = start; i <= end; i++) {
		if (!(i % mod)) arr.push(i);
	}
	return arr;
}

function App() {
	const [imgNum, setImgNum] = useState(0);
	const [yearNum, setYearNum] = useState(1918);
	const [guessYear, setGuessYear] = useState(1958);
	const [showResult, setShowResult] = useState(false);
	const [resultData, setResultData] = useState({});

	const db = getDatabase();

	function randomImage() {
		let randomYear = Math.floor(Math.random() * 116) + 1900;
		setYearNum(randomYear);
		let randomNum = Math.floor(Math.random() * images[randomYear].length);
		setImgNum(randomNum);
	}

	function saveGuess() {
		let temp = images[yearNum][imgNum]
			.replaceAll("/", "")
			.replaceAll(".", "")
			.replaceAll("$", "")
			.replaceAll("#", "");
		const imageRef = ref(db, "images/" + temp);
		let data = {};
		onValue(imageRef, (snapshot) => {
			data = snapshot.val();
			setResultData(data);
		});
		if (!data) {
			set(imageRef, {
				[guessYear]: 1,
			});
		} else {
			console.log(data);
			data[guessYear] = (data[guessYear] || 0) + 1;
			set(imageRef, data);
		}
	}

	useEffect(() => {
		randomImage();
	}, []);

	useEffect(() => {
		window.scroll({
			top: document.body.offsetHeight,
			left: 0,
			behavior: "smooth",
		});
	}, [showResult]);

	return (
		<SectionContainer>
			<GameContainer>
				<ImgContainer>
					<CenterImage src={images[yearNum][imgNum]} />
				</ImgContainer>
				<GuessContainer>
					<h1>{guessYear}</h1>
					<YearInput
						type="range"
						min="1900"
						max="2015"
						value={guessYear}
						disabled={showResult}
						onChange={(e) => setGuessYear(e.target.value)}
						list="stepList"
					/>
					<YearDatalist id="stepList">
						{rangeArray(1900, 2015, 5).map((x) => (
							<option
								style={{ padding: "0", marginTop: "4vh" }}
								label={x}
								value={x}
							>
								{x}
							</option>
						))}
					</YearDatalist>
					<GuessButton
						onClick={() => {
							setShowResult(true);
							saveGuess();
						}}
						disabled={showResult}
					>
						<h1>Guess</h1>
					</GuessButton>
				</GuessContainer>
			</GameContainer>
			<ResultsContainer style={{ display: showResult ? "flex" : "none" }}>
				<h2>
					Your Guess Was:{" "}
					<span style={{ color: "blue" }}> {guessYear} </span> &nbsp; &nbsp;
					The Correct Year Was:{" "}
					<span style={{ color: "green" }}> {yearNum} </span>
				</h2>
				<br />
				<HistogramContainer>
					{rangeArray(1900, 2015, 1).map(function (x) {
						let z = 0;
						let max = Math.max(...Object.values(resultData));
						let min = 0;
						if (Object.values(resultData).length === 115)
							min = Math.min(...Object.values(resultData));
						if (x in resultData) {
							z = (resultData[x] - min) / (max - min);
							console.log(z, resultData[x], max, min);
						}
						return (
							<Bar
								style={{
									height: `${z * 100}%`,
									backgroundColor:
										x === Number(guessYear)
											? "blue"
											: "grey",
									border:
										x === Number(yearNum)
											? "solid green 2px"
											: "none",
								}}
							/>
						);
					})}
				</HistogramContainer>
				<HistogramYearContainer>
					{rangeArray(1900, 2015, 5).map(function (x) {
						return <p>{x}</p>;
					})}
				</HistogramYearContainer>
				<GuessButton
					onClick={() => {
						randomImage();
						setShowResult(false);
						setGuessYear(1958);
					}}
				>
					<h1>Next Image</h1>
				</GuessButton>
			</ResultsContainer>
		</SectionContainer>
	);
}

export default App;
