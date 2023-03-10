import { useState } from "react";
import styled, { keyframes } from "styled-components";
import images from "./USA.json";

const Stream = keyframes`
  0% {
    transform: translateX(calc(100vw + 100%));
  }
  100% {
    transform: translateX(-100%);
  }
`;

const SectionContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #1e1e1e;
  position: fixed;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const StreamContainer = styled.div`
  width: 100%;
  height: 25%;
  position: relative;
`;

const StreamImage = styled.img`
  height: 100%;
  width: 15%;
  object-fit: contain;
  animation: ${Stream} 30s linear infinite;
  position: absolute;
`;

const TranslucentContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 15;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const GuessButton = styled.button`
  margin: 2vmax;
  width: 20%;
  min-width: 200px;
  border-radius: 2vmax;
  border-color: white;
  color: white;
  cursor: pointer;
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

function Home() {
  const [home, setHome] = useState(true);
  return (
    <SectionContainer style={{ display: home ? "flex" : "none" }}>
      <TranslucentContainer>
        <h1 style={{ fontSize: "10vw", margin: "2vmax" }}>Snapshotle</h1>
        <h1 style={{ margin: "2vmax", textAlign: "center" }}>
          See The Image, Guess The Year, Beat The Average
        </h1>
        <GuessButton
          style={{ backgroundColor: "#221c4d" }}
          onClick={() => {
            setHome(false);
          }}
        >
          <h1>Play</h1>
        </GuessButton>
      </TranslucentContainer>
      <StreamContainer>
        {rangeArray(0, 5, 1).map(function (x) {
          let year = Math.floor(Math.random() * 116) + 1900;
          let num = Math.floor(Math.random() * images[year].length);
          return (
            <StreamImage
              style={{ animationDelay: `${-5 * x}s` }}
              src={images[year][num]}
            />
          );
        })}
      </StreamContainer>
      <StreamContainer>
        {rangeArray(0, 5, 1).map(function (x) {
          let year = Math.floor(Math.random() * 116) + 1900;
          let num = Math.floor(Math.random() * images[year].length);
          return (
            <StreamImage
              style={{
                animationDelay: `${-5 * x}s`,
                animationDirection: "reverse",
              }}
              src={images[year][num]}
            />
          );
        })}
      </StreamContainer>
      <StreamContainer>
        {rangeArray(0, 5, 1).map(function (x) {
          let year = Math.floor(Math.random() * 116) + 1900;
          let num = Math.floor(Math.random() * images[year].length);
          return (
            <StreamImage
              style={{ animationDelay: `${-5 * x}s` }}
              src={images[year][num]}
            />
          );
        })}
      </StreamContainer>
    </SectionContainer>
  );
}

export default Home;
