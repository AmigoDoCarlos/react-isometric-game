import styled from "@emotion/styled";
  
export const Body = styled.div`
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    min-height: 100vh;
    background: red;
    background-color: #242424;
    box-sizing: bordex-box;
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    overflow: hidden;
`;

export const EscapeRoom = styled.canvas`
    image-rendering: pixelated;
    background: #AAAAAA;
    border-radius: 30px;
    border: 2px solid black;
`;

export const ScoreBoard = styled.div`
    padding: 5px;
    background-color: #800080;
    border-radius: 35px;
    position: relative;
`;

export const Score = styled.p`
    width: 15%;
    height: 50px;
    position: absolute;
    margin: 0;
    background-color: #800080;
    color: white;
    border-radius: 0 0 20px;
    border-right: 2px solid black;
    border-bottom: 2px solid black;
    font-size: 20px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
`;