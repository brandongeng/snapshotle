import images from "./USA.json";
import nlImages from "./nl.json";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { app } from "./firebase";
import { getDatabase, ref, set, get } from "firebase/database";
import Home from "./Home";

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
  color: white;
  background-color: #1e1e1e;
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
  min-width: 300px;
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
  background-color: white;
  color: "white";
`;

const GuessButton = styled.button`
  margin: 2vmax;
  width: 20%;
  min-width: 200px;
  border-radius: 2vmax;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.2);
  border-color: grey;
  cursor: pointer;
`;

const SmallButton = styled.button`
  margin-left: 2vmax;
  margin-right: 2vmax;
  width: 10%;
  min-width: 100px;
  border-radius: 1vmax;
  cursor: pointer;
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

const AdjustContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

const AdjustButton = styled.button`
  height: 50%;
  width: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function rangeArray(start, end, mod) {
  if (start > end) {
    return [];
  }
  let arr = [];
  for (let i = start; i <= end; i++) {
    if (!((i - 1900) % mod)) arr.push(i);
  }
  return arr;
}

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

function App() {
  const [imgNum, setImgNum] = useState(0);
  const [yearNum, setYearNum] = useState(0);
  const [guessYear, setGuessYear] = useState(1958);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState({});
  const [openFeedback, setOpenFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [imageSet, setImageSet] = useState(images);
  const [nl, setNl] = useState(false);

  const { height, width } = useWindowDimensions();

  const db = getDatabase();

  function randomImage() {
    if (!nl) {
      let randomYear = Math.floor(Math.random() * 116) + 1900;
      setYearNum(randomYear);
      let randomNum = Math.floor(Math.random() * imageSet[randomYear].length);
      setImgNum(randomNum);
    } else {
      let randomYear = Math.floor(Math.random() * 9) + 2013;
      setYearNum(randomYear);
      let randomNum = Math.floor(Math.random() * imageSet[randomYear].length);
      setImgNum(randomNum);
    }
  }

  function saveGuess() {
    let temp = imageSet[yearNum][imgNum]
      .replaceAll("/", "")
      .replaceAll(".", "")
      .replaceAll("$", "")
      .replaceAll("#", "");
    const imageRef = ref(db, "images/" + temp);
    get(imageRef).then((snapshot) => {
      if (snapshot.exists()) {
        let data = snapshot.val();
        data[guessYear] = (data[guessYear] || 0) + 1;
        set(imageRef, data);
        setResultData(data);
      } else {
        set(imageRef, {
          [guessYear]: 1,
        });
        setResultData({
          [guessYear]: 1,
        });
      }
    });
  }

  function nlModeOn() {
    setImgNum(0);
    setYearNum(0);
    setNl(true);
    setImageSet(nlImages);
    setGuessYear(2017);
  }

  useEffect(() => {
    randomImage();
  }, [nl]);

  useEffect(() => {
    window.scroll({
      top: document.body.offsetHeight,
      left: 0,
      behavior: "smooth",
    });
  }, [showResult]);

  return (
    <SectionContainer>
      <Home nl={nlModeOn}></Home>
      <GameContainer>
        <ImgContainer>
          <CenterImage src={imageSet[yearNum][imgNum]} />
        </ImgContainer>
        <GuessContainer>
          <AdjustContainer>
            <AdjustButton
              style={{ display: width > 900 ? "none" : "flex" }}
              onClick={() => {
                if (!nl && guessYear !== 1900) setGuessYear(guessYear - 1);
                if (nl && guessYear !== 2013) setGuessYear(guessYear - 1);
              }}
            >
              <h1>-</h1>
            </AdjustButton>
            <h1>{guessYear}</h1>
            <AdjustButton
              style={{ display: width > 900 ? "none" : "flex" }}
              onClick={() => {
                if (!nl && guessYear !== 2015) setGuessYear(guessYear + 1);
                if (nl && guessYear !== 2021) setGuessYear(guessYear + 1);
              }}
            >
              <h1>+</h1>
            </AdjustButton>
          </AdjustContainer>
          <YearInput
            type="range"
            min={!nl ? "1900" : "2013"}
            max={!nl ? "2015" : "2021"}
            value={guessYear}
            disabled={showResult}
            onChange={(e) => setGuessYear(e.target.value)}
            list="stepList"
            step="1"
          />
          <YearDatalist id="stepList">
            {!nl
              ? rangeArray(1900, 2015, width < 900 ? 23 : 5).map((x) => (
                  <option
                    style={{
                      padding: "0",
                      marginTop: "4vh",
                      color: "white",
                    }}
                    label={x}
                  ></option>
                ))
              : rangeArray(2013, 2021, 1).map((x) => (
                  <option
                    style={{
                      padding: "0",
                      marginTop: "4vh",
                      color: "white",
                    }}
                    label={x}
                  ></option>
                ))}
          </YearDatalist>
          <GuessButton
            onClick={() => {
              setShowResult(true);
              saveGuess();
            }}
            style={{ cursor: showResult ? "default" : "pointer" }}
            disabled={showResult}
          >
            <h1>Guess</h1>
          </GuessButton>
        </GuessContainer>
      </GameContainer>
      <ResultsContainer style={{ display: showResult ? "flex" : "none" }}>
        <h2 style={{ textAlign: "center" }}>
          Your Guess Was: <span style={{ color: "blue" }}> {guessYear} </span>{" "}
          <br /> The Correct Year Was:{" "}
          <span style={{ color: "green" }}> {yearNum} </span>
        </h2>
        <br />
        <HistogramContainer>
          {!nl
            ? rangeArray(1900, 2015, 1).map(function (x) {
                let z = 0;
                let max = Math.max(...Object.values(resultData));
                let min = 0;
                if (Object.values(resultData).length === 115)
                  min = Math.min(...Object.values(resultData));
                if (x in resultData) {
                  z = (resultData[x] - min) / (max - min);
                }
                return (
                  <Bar
                    style={{
                      height: `${z * 100}%`,
                      backgroundColor:
                        x === Number(guessYear) ? "blue" : "grey",
                      border:
                        x === Number(yearNum)
                          ? x === Number(guessYear)
                            ? "solid green 5px"
                            : "solid green 2px"
                          : "none",
                    }}
                  />
                );
              })
            : rangeArray(2013, 2021, 1).map(function (x) {
                let z = 0;
                let max = Math.max(...Object.values(resultData));
                let min = 0;
                if (Object.values(resultData).length === 9)
                  min = Math.min(...Object.values(resultData));
                if (x in resultData) {
                  z = (resultData[x] - min) / (max - min);
                }
                return (
                  <Bar
                    style={{
                      height: `${z * 100}%`,
                      backgroundColor:
                        x === Number(guessYear) ? "blue" : "grey",
                      border:
                        x === Number(yearNum)
                          ? x === Number(guessYear)
                            ? "solid green 5px"
                            : "solid green 2px"
                          : "none",
                    }}
                  />
                );
              })}
        </HistogramContainer>
        <HistogramYearContainer>
          {!nl
            ? rangeArray(1900, 2015, width < 900 ? 23 : 5).map(function (x) {
                return <p>{x}</p>;
              })
            : rangeArray(2013, 2021, 1).map(function (x) {
                return <p>{x}</p>;
              })}
        </HistogramYearContainer>
        <GuessButton
          onClick={() => {
            randomImage();
            setShowResult(false);
            if (!nl) setGuessYear(1958);
            else setGuessYear(2017);
          }}
        >
          <h1>Next Image</h1>
        </GuessButton>
        <p>
          Is there an issue with the image?{" "}
          <span
            style={{
              textDecoration: "underline",
              color: "teal",
              cursor: "pointer",
            }}
            onClick={() => {
              setOpenFeedback(true);
            }}
          >
            {" "}
            Give Feedback{" "}
          </span>
        </p>
      </ResultsContainer>
      <div
        style={{
          height: "100%",
          width: "100%",
          background: "rgba(0,0,0,0.75)",
          position: "fixed",
          top: "50%",
          transform: "translate(0, -50%)",
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
          display: openFeedback ? "flex" : "none",
        }}
      >
        <div
          style={{
            width: "40%",
            height: "50%",
            minWidth: "300px",
            padding: "5%",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            flexDirection: "column",
            borderRadius: "2vmax",
            backgroundColor: "#1e1e1e",
          }}
        >
          <h2>This Images Has...</h2>
          <form
            onChange={(e) => {
              setFeedback(e.target.value);
            }}
          >
            <input
              type="radio"
              id="inappropriate"
              name="feedback"
              value="unsuitable"
              checked={feedback === "inappropriate"}
            />
            <label for="inappropriate">
              {" "}
              <h3 style={{ display: "inline" }}>
                Inappropriate Stuff (Nudity, Excessive Violence, Problematic)
              </h3>
            </label>
            <br />
            <br />
            <input
              type="radio"
              id="low quality"
              name="feedback"
              value="low"
              checked={feedback === "low"}
            />
            <label for="low quality">
              {" "}
              <h3 style={{ display: "inline" }}>
                Low Quality Images (Low Resolution, Grainy, Blurry){" "}
              </h3>
            </label>
            <br />
            <br />
            <input
              type="radio"
              id="no context"
              name="feedback"
              value="context"
              checked={feedback === "context"}
            />
            <label for="no context">
              {" "}
              <h3 style={{ display: "inline" }}>Not Enough Context to Guess</h3>
            </label>
            <br />
            <br />
            <input
              type="radio"
              id="wrong year"
              name="feedback"
              value="year"
              checked={feedback === "year"}
            />
            <label for="wrong year">
              {" "}
              <h3 style={{ display: "inline" }}>The Wrong Year</h3>
            </label>
            <br />
            <br />
          </form>
          <div style={{ display: "flex" }}>
            <SmallButton
              onClick={() => {
                setOpenFeedback(false);
                setFeedback("");
              }}
            >
              <h2>Submit</h2>
            </SmallButton>
            <SmallButton
              onClick={() => {
                setOpenFeedback(false);
                setFeedback("");
              }}
            >
              <h2>Cancel</h2>
            </SmallButton>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

export default App;
