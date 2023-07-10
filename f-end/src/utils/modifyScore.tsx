export const modifyScore = (score: string) => {
  let remainingWickets: string = score.charAt(score.length - 1);
  let mWickets =
    remainingWickets == "a" ? "0" : (10 - Number(remainingWickets)).toString();
  let mScore = Number(score.slice(0, -1)).toString();
  return mScore.concat("-", mWickets);
};
