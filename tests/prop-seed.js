// tests/prop-seed.js — Deterministyczne ziarno generatorów losowych (BR-TEST-008)
const envSeed = process.env.PROP_SEED || process.env.MATRIX_SEED;
let seed = 0x5eed1234;

if (envSeed === 'random') {
  seed = Math.floor(Math.random() * 0x7fffffff);
} else if (envSeed && !Number.isNaN(Number(envSeed))) {
  seed = Number(envSeed);
}

module.exports = {
  PROP_SEED: seed,
  MATRIX_RUNS: Number(process.env.MATRIX_RUNS || 200),
};
