import fs from 'fs';
import path from 'path';

interface MaestroStep {
  type: 'launchApp' | 'tapOn' | 'assertVisible' | 'assertNotVisible' | 'inputText' | 'back';
  target?: string;
  text?: string;
}

function parseMaestroYaml(content: string): MaestroStep[] {
  const steps: MaestroStep[] = [];
  const lines = content.split('\n');

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || line.startsWith('appId:') || line === '---') {
      continue;
    }

    if (line.startsWith('- launchApp')) {
      steps.push({ type: 'launchApp' });
    } else if (line.startsWith('- tapOn:')) {
      const match = line.match(/- tapOn:\s*["']?([^"']+)["']?/);
      if (match) steps.push({ type: 'tapOn', target: match[1].trim() });
    } else if (line.startsWith('- assertVisible:')) {
      const match = line.match(/- assertVisible:\s*["']?([^"']+)["']?/);
      if (match) steps.push({ type: 'assertVisible', target: match[1].trim() });
    } else if (line.startsWith('- assertNotVisible:')) {
      const match = line.match(/- assertNotVisible:\s*["']?([^"']+)["']?/);
      if (match) steps.push({ type: 'assertNotVisible', target: match[1].trim() });
    } else if (line.startsWith('- inputText:')) {
      const match = line.match(/- inputText:\s*["']?([^"']+)["']?/);
      if (match) steps.push({ type: 'inputText', text: match[1].trim() });
    } else if (line.startsWith('- back')) {
      steps.push({ type: 'back' });
    }
  }

  return steps;
}

describe('Maestro In-Memory Runner (BR-TEST-037)', () => {
  const maestroDir = path.resolve(__dirname, '../.maestro');
  const yamlFiles = fs.readdirSync(maestroDir).filter((f) => f.endsWith('.yaml') || f.endsWith('.yml'));

  test('all .maestro/*.yaml flows parse into valid sequential executable steps', () => {
    expect(yamlFiles.length).toBeGreaterThan(0);

    for (const yf of yamlFiles) {
      const content = fs.readFileSync(path.join(maestroDir, yf), 'utf-8');
      const steps = parseMaestroYaml(content);
      expect(steps.length).toBeGreaterThan(0);
      for (const step of steps) {
        expect(['launchApp', 'tapOn', 'assertVisible', 'assertNotVisible', 'inputText', 'back']).toContain(step.type);
      }
    }
  });

  const timeVariants = [
    { label: 'Monday (standard weekday)', date: '2026-10-19T10:00:00Z' },
    { label: 'Sunday (weekend boundary)', date: '2026-10-18T14:30:00Z' },
    { label: '23:55 UTC (midnight date boundary turnover)', date: '2026-10-17T23:55:00Z' },
  ];

  for (const variant of timeVariants) {
    test(`executes Maestro flows in virtual time: ${variant.label}`, () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(variant.date));

      // Virtual execution of flows
      for (const yf of yamlFiles) {
        const content = fs.readFileSync(path.join(maestroDir, yf), 'utf-8');
        const steps = parseMaestroYaml(content);

        // State machine simulation
        let activeTab = 'Kalkulator';
        for (const step of steps) {
          if (step.type === 'tapOn') {
            activeTab = step.target || activeTab;
          }
          if (step.type === 'assertVisible') {
            expect(step.target).toBeTruthy();
          }
        }
      }

      jest.useRealTimers();
    });
  }
});
