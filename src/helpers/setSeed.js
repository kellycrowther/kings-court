export function setSeed(row, racers, roundResultKey, heatDataIndex) {
  // get the current seed index
  let currentRoundSeedIndex;
  if (heatDataIndex === "Round1Heat") {
    currentRoundSeedIndex = "Seed";
  } else if (heatDataIndex === "Round2Heat") {
    currentRoundSeedIndex = "Round2Seed";
  } else if (heatDataIndex === "Round3Heat") {
    currentRoundSeedIndex = "Round3Seed";
  }

  // get the next round seed index
  let nextRoundSeed;
  if (heatDataIndex === "Round2Heat") {
    nextRoundSeed = "Round3Seed";
  } else if (heatDataIndex === "Round1Heat") {
    nextRoundSeed = "Round2Seed";
  } else if (heatDataIndex === "Round3Heat") {
    nextRoundSeed = "FinalResult";
  }

  // get the next round heat index
  let nextHeatIndex;
  if (heatDataIndex === "Round1Heat") {
    nextHeatIndex = "Round2Heat";
  } else if (heatDataIndex === "Round2Heat") {
    nextHeatIndex = "Round3Heat";
  }

  // get all the racers in the selected racer's heat and sort them by highest to lowest seed
  const racerHeat = racers
    .filter(racer => racer[heatDataIndex] === row[heatDataIndex])
    .sort((a, b) => a - b);

  // copy the racers around to use for getting the last heat
  const sortRacers = [...racers];

  // get the last heat
  const lastHeat = sortRacers
    .sort((a, b) => b[heatDataIndex] - a[heatDataIndex])
    .find(racer => racer.Gender === row.Gender)[heatDataIndex];

  // get the index of the object of the seed that corresponds to the racer's placement after the heat
  const indexOfPostRaceSeedWithinCurrentRound = row[roundResultKey] - 1;

  // using the index, get the index of what seed they actually placed as based on their results
  const seedWithinCurrentRound = parseInt(
    racerHeat[indexOfPostRaceSeedWithinCurrentRound][currentRoundSeedIndex]
  );

  // find the heat within the current round
  const heatWithinCurrentRound = parseInt(
    racerHeat[indexOfPostRaceSeedWithinCurrentRound][heatDataIndex]
  );

  // handle the heat 1 edge since racers seeded 1-4 will just move on to next round
  if (row.Round1Heat === 1 && row[roundResultKey] <= 4) {
    row[nextRoundSeed] = seedWithinCurrentRound;
    row[nextHeatIndex] = heatWithinCurrentRound;
  }
  // racers 5-6 increase their seed by two and increment the heat by two
  if (row.Round1Heat === 1 && row[roundResultKey] > 4) {
    row[nextRoundSeed] = seedWithinCurrentRound + 2;
    row[nextHeatIndex] = heatWithinCurrentRound + 2;
  }

  // handle all the heats between the first and the last heat
  // racers who are the top two in the heat move up two seeds and up a heat
  if (row.Round1Heat > 1 && row[roundResultKey] <= 2) {
    row[nextRoundSeed] = seedWithinCurrentRound - 2;
    row[nextHeatIndex] = heatWithinCurrentRound - 2;
  }
  // racers who placed in the middle two retain their current seed and heat
  if (
    row.Round1Heat > 1 &&
    row[roundResultKey] > 2 &&
    row[roundResultKey] <= 4
  ) {
    row[nextRoundSeed] = seedWithinCurrentRound;
    row[nextHeatIndex] = heatWithinCurrentRound;
  }
  // racers who are the last two in their heat move down two seeds and increment heat by two
  if (row.Round1Heat > 1 && row[roundResultKey] > 4) {
    row[nextRoundSeed] = seedWithinCurrentRound + 2;
    row[nextHeatIndex] = heatWithinCurrentRound + 2;
  }

  // handle the last heat edge since racers seeded 3-6 will just move on to next round and stay in the same heat
  if (row[heatDataIndex] === lastHeat && row[roundResultKey] <= 2) {
    row[nextRoundSeed] = seedWithinCurrentRound - 2;
    row[nextHeatIndex] = heatWithinCurrentRound - 2;
  }
  if (row[heatDataIndex] === lastHeat && row[roundResultKey] > 2) {
    row[nextRoundSeed] = seedWithinCurrentRound;
    row[nextHeatIndex] = heatWithinCurrentRound;
  }
  // consider creating a handler to set final results instead of hacking this
  if (nextRoundSeed === "FinalResult") {
    row[nextRoundSeed] = seedWithinCurrentRound;
  }
  return row;
}
