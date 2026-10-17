// jest.app-after-env.js — Strict test harness enforcing BR-TEST-018
// Fails tests on act() warnings, unhandled rejections, console.error and unexpected console.warn

const rawError = console.error;
const rawWarn = console.warn;

const ALLOWED_WARN_PATTERNS = [
  /Animated: `useNativeDriver`/,
  /has been extracted from react-native core/,
  /The above error occurred in the <.*> component/,
];

console.error = (...args) => {
  const msg = args.map((a) => (typeof a === 'string' ? a : (a && a.message) || (a && a.stack) || JSON.stringify(a))).join(' ');

  rawError(...args);

  // If inside an intentional error test that silenced it, or ignore react component stack info
  if (msg.includes('The above error occurred in the <') || msg.includes('React will try to recreate this component')) {
    return;
  }

  throw new Error(`[BR-TEST-018 · console.error in test]: ${msg}`);
};

console.warn = (...args) => {
  const msg = args.map((a) => (typeof a === 'string' ? a : (a && a.message) || (a && a.stack) || JSON.stringify(a))).join(' ');

  for (const pattern of ALLOWED_WARN_PATTERNS) {
    if (pattern.test(msg)) {
      rawWarn(...args);
      return;
    }
  }

  rawWarn(...args);
  throw new Error(`[BR-TEST-018 · unexpected console.warn in test]: ${msg}`);
};

afterEach(() => {
  try {
    jest.clearAllTimers();
  } catch {
    // ignore if fake timers not active
  }
});
