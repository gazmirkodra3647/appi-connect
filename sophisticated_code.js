/* 
 * Filename: sophisticated_code.js
 * 
 * Description: This code showcases a professional and complex example of Advanced Genetic Algorithm. 
 * It demonstrates how to solve the Travelling Salesman Problem using a Genetic Algorithm approach.
 * The code is over 200 lines long and contains various custom classes, functions, and algorithms.
 * The comments within the code explain the functionality of each section.
 *
 * Note: Running this code might require libraries/modules such as math.js or lodash.
 */
 
// Define necessary classes, functions, variables, and constants...

// Class representing a City
class City {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  distanceTo(city) {
    const dx = Math.abs(this.x - city.x);
    const dy = Math.abs(this.y - city.y);

    return Math.sqrt(dx*dx + dy*dy);
  }
}

// Class representing a tour (ordered list of cities)
class Tour {
  constructor() {
    this.cities = [];
    this.distance = 0;
  }
  
  initialize() {
    for (let i = 0; i < totalCities; i++) {
      this.cities[i] = null;
    }
  }
  
  generateIndividual() {
    for (let cityIndex = 0; cityIndex < totalCities; cityIndex++) {
      const newCity = getRandomCity();
      this.setCity(cityIndex, newCity);
    }

    // Shuffle the tour for additional randomness
    this.shuffle();
  }
  
  getCity(index) {
    return this.cities[index];
  }
  
  setCity(index, city) {
    this.cities[index] = city;
    this.distance = 0;
  }
  
  getDistance() {
    if (this.distance === 0) {
      let tourDistance = 0;

      for (let cityIndex = 0; cityIndex < totalCities; cityIndex++) {
        const fromCity = this.getCity(cityIndex);
        const toCity = (cityIndex + 1 < totalCities) ? this.getCity(cityIndex + 1) : this.getCity(0);
        tourDistance += fromCity.distanceTo(toCity);
      }

      this.distance = tourDistance;
    }
    return this.distance;
  }
  
  shuffle() {
    for (let i = 0; i < totalCities; i++) {
      const randomIndex = Math.floor(Math.random() * totalCities);
      const temp = this.cities[i];
      this.cities[i] = this.cities[randomIndex];
      this.cities[randomIndex] = temp;
    }
  }
}

// Create an initial population of tours
function initializePopulation() {
  const population = [];
  for (let i = 0; i < populationSize; i++) {
    const tour = new Tour();
    tour.initialize();
    tour.generateIndividual();
    population[i] = tour;
  }
  return population;
}

// Evolution: Crossover and Mutation
function evolvePopulation(currentPopulation) {
  const newPopulation = [];
  
  // Elitism: Preserve the best individual
  newPopulation[0] = getFittest(currentPopulation);
  
  // Crossover: Perform crossover between parents to create offspring
  for (let i = 1; i < populationSize; i++) {
    const parent1 = selectParent(currentPopulation);
    const parent2 = selectParent(currentPopulation);
    const offspring = crossover(parent1, parent2);
    newPopulation[i] = offspring;
  }
  
  // Mutation: Apply mutation to the offspring
  for (let i = 1; i < populationSize; i++) {
    mutate(newPopulation[i]);
  }
  
  return newPopulation;
}

// Select a parent using tournament selection
function selectParent(currentPopulation) {
  const tournamentSize = 5;
  const tournament = [];
  
  // Randomly select individuals and add them to the tournament
  for (let i = 0; i < tournamentSize; i++) {
    const randomIndex = Math.floor(Math.random() * populationSize);
    tournament[i] = currentPopulation[randomIndex];
  }
  
  // Select the fittest individual from the tournament
  return getFittest(tournament);
}

// Crossover: Create a new offspring by combining parent1 and parent2
function crossover(parent1, parent2) {
  const offspring = new Tour();
  offspring.initialize();
  
  // Generate a random range for the crossover
  const startPos = Math.floor(Math.random() * totalCities);
  const endPos = Math.floor(Math.random() * totalCities);

  // Make sure start and end positions are valid
  const [fromIndex, toIndex] = startPos < endPos ? [startPos, endPos] : [endPos, startPos];
  
  // Copy the sub-tour from parent1 to offspring
  for (let i = fromIndex; i <= toIndex; i++) {
    const city = parent1.getCity(i);
    offspring.setCity(i, city);
  }
  
  // Fill in the remaining cities from parent2
  for (let i = 0; i < totalCities; i++) {
    const city = parent2.getCity(i);

    // Skip if the city is already in the offspring's sub-tour
    if (!offspring.cities.includes(city)) {
      offspring.setCity(offspring.cities.indexOf(null), city);
    }
  }
  
  return offspring;
}

// Mutation: Randomly swap two cities in the tour
function mutate(tour) {
  for (let i = 0; i < totalCities; i++) {
    if (Math.random() < mutationRate) {
      const index1 = Math.floor(Math.random() * totalCities);
      const index2 = Math.floor(Math.random() * totalCities);
      tour.cities[index1] = tour.cities.splice(index2, 1, tour.cities[index1])[0];
    }
  }
}

// Get the fittest tour from the population
function getFittest(population) {
  let fittestIndex = 0;

  for (let i = 1; i < populationSize; i++) {
    if (population[i].getDistance() < population[fittestIndex].getDistance()) {
      fittestIndex = i;
    }
  }

  return population[fittestIndex];
}

// Main Genetic Algorithm function
function geneticAlgorithm() {
  let population = initializePopulation();
  
  for (let generation = 0; generation < maxGenerations; generation++) {
    population = evolvePopulation(population);
  }
  
  const fittestTour = getFittest(population);
  
  return fittestTour;
}

// Define problem-specific variables and constants
const totalCities = 10;
const populationSize = 50;
const mutationRate = 0.01;
const maxGenerations = 1000;

// Generate a random city
function getRandomCity() {
  const x = Math.floor(Math.random() * 200);
  const y = Math.floor(Math.random() * 200);
  return new City(x, y);
}

// Execute the Genetic Algorithm
const result = geneticAlgorithm();

// Print the result
console.log("Fittest Tour Distance: ", result.getDistance());
console.log("Fittest Tour: ", result.cities.map(city => `(${city.x},${city.y})`));