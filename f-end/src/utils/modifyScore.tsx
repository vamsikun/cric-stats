import { teamsOptions } from "@/data";
export const modifyScore = (score: string) => {
  let teamID = score.split("-")[1];
  let team = teamsOptions.find((ele) => ele.apiValue == teamID);
  score = score.split("-")[0];
  let remainingWickets: string = score.charAt(score.length - 1);
  let mWickets =
    remainingWickets == "a" ? "0" : (10 - Number(remainingWickets)).toString();
  let mScore = Number(score.slice(0, -1)).toString();
  return mScore.concat("-", mWickets) + " " + `(${team.value})`;
};
