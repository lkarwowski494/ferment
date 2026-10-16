import {
  getEmergencyRescueProtocol,
  searchEmergencyProtocols,
  EMERGENCY_PROTOCOLS,
} from '../../src/core/emergency-recovery';

describe('FERMENT Emergency Recovery & Triage Protocols', () => {
  it('retrieves detailed rescue protocol for stalled curd setting', () => {
    const protocol = getEmergencyRescueProtocol('WEAK_CURD_NO_SET');
    expect(protocol.title).toContain('Brak Zestalenia');
    expect(protocol.severity).toBe('CRITICAL');
    expect(protocol.isDiscardMandatory).toBe(false);
    expect(protocol.stepByStepRescue.length).toBe(5);
    expect(protocol.stepByStepRescue[1]).toContain('CaCl2');
  });

  it('mandates discard for real SCOBY mold infestation with mycotoxin warning', () => {
    const moldProtocol = getEmergencyRescueProtocol('SCOBY_MOLD_INFESTATION');
    expect(moldProtocol.isDiscardMandatory).toBe(true);
    expect(moldProtocol.severity).toBe('FATAL_DISCARD');
    expect(moldProtocol.stepByStepRescue[1]).toContain('BEZWZGLĘDNIE WYRZUĆ');
  });

  it('allows keyword searching across symptoms and causes', () => {
    const results = searchEmergencyProtocols('kożuszek');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results.some(r => r.id === 'KAHM_SURFACE_OUTBREAK')).toBe(true);

    const brineResults = searchEmergencyProtocols('skórka');
    expect(brineResults.some(r => r.id === 'SLIMY_BRINE_RIND_DEFECT')).toBe(true);
  });
});
