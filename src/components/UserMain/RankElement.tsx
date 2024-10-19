import { memo } from "react";

const RankElement = memo(
  ({
    currUser,
    rank,
  }: {
    currUser?: string;
    rank: { playername: string; points: number }[];
  }) => {
    if (!rank) return <h4>Loading points...</h4>;
    if (!rank.length) {
      return (
        <h4>Not players registered yet or you dont have played any match</h4>
      );
    } else {
      return (
        <div
          style={{
            height: "360px",
            aspectRatio: 1,
            border: "1px solid #b836ba",
            overflowY: "scroll",
            scrollbarWidth: "thin",
          }}
        >
          {[...rank]
            .sort(
              ({ points: pointsA }, { points: pointsB }) => pointsB - pointsA
            )
            .map(({ playername, points }, ix) => (
              <p
                key={ix}
                style={{
                  borderBottom: "1px solid #b836ba",
                  margin: 0,
                  padding: ".5rem 0",
                }}
              >
                <span> #{ix + 1} </span>
                <span
                  style={{
                    color: currUser === playername ? "#B836BA" : "#535BF2",
                  }}
                >
                  {playername}:
                </span>
                <span> {points}</span>
              </p>
            ))}
        </div>
      );
    }
  }
);

export default RankElement;
