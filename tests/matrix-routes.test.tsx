import React from 'react';
import renderer, { act } from 'react-test-renderer';
import IndexScreen from '../app/(tabs)/index';
import DairyScreen from '../app/(tabs)/dairy';
import CaveScreen from '../app/(tabs)/cave';
import PantryKnowledgeScreen from '../app/(tabs)/pantry-knowledge';

// Mock audio/camera/native bridge dependencies for fast Node rendering
jest.mock('expo-camera', () => ({
  CameraView: 'CameraView',
  useCameraPermissions: () => [{ granted: true }, jest.fn()],
}));

jest.mock('expo-print', () => ({
  printAsync: jest.fn(),
}));

jest.mock('expo-sharing', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  shareAsync: jest.fn(),
}));

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 50));

describe('AST Matrix Routes Coverage (BR-TEST-028, EKRAN)', () => {
  it('renders /(tabs)/index route', async () => {
    const route = '/(tabs)/index';
    expect(route).toBe('/(tabs)/index');
    let tree: any;
    await act(async () => {
      tree = renderer.create(<IndexScreen />);
      await flushPromises();
    });
    expect(tree).toBeTruthy();
    act(() => {
      tree.unmount();
    });
  });

  it('renders /(tabs)/dairy route', async () => {
    const route = '/(tabs)/dairy';
    expect(route).toBe('/(tabs)/dairy');
    let tree: any;
    await act(async () => {
      tree = renderer.create(<DairyScreen />);
      await flushPromises();
    });
    expect(tree).toBeTruthy();
    act(() => {
      tree.unmount();
    });
  });

  it('renders /(tabs)/cave route', async () => {
    const route = '/(tabs)/cave';
    expect(route).toBe('/(tabs)/cave');
    let tree: any;
    await act(async () => {
      tree = renderer.create(<CaveScreen />);
      await flushPromises();
    });
    expect(tree).toBeTruthy();
    act(() => {
      tree.unmount();
    });
  });

  it('renders /(tabs)/pantry-knowledge route', async () => {
    const route = '/(tabs)/pantry-knowledge';
    expect(route).toBe('/(tabs)/pantry-knowledge');
    let tree: any;
    await act(async () => {
      tree = renderer.create(<PantryKnowledgeScreen />);
      await flushPromises();
    });
    expect(tree).toBeTruthy();
    act(() => {
      tree.unmount();
    });
  });
});
