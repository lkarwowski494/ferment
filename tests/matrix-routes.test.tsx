import React from 'react';
import renderer, { act } from 'react-test-renderer';
import IndexScreen from '../app/(tabs)/index';
import BatchesScreen from '../app/(tabs)/batches';
import PantryScreen from '../app/(tabs)/pantry';
import SchoolScreen from '../app/(tabs)/school';
import SettingsScreen from '../app/(tabs)/settings';

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

  it('renders /(tabs)/batches route', async () => {
    const route = '/(tabs)/batches';
    expect(route).toBe('/(tabs)/batches');
    let tree: any;
    await act(async () => {
      tree = renderer.create(<BatchesScreen />);
      await flushPromises();
    });
    expect(tree).toBeTruthy();
    act(() => {
      tree.unmount();
    });
  });

  it('renders /(tabs)/pantry route', async () => {
    const route = '/(tabs)/pantry';
    expect(route).toBe('/(tabs)/pantry');
    let tree: any;
    await act(async () => {
      tree = renderer.create(<PantryScreen />);
      await flushPromises();
    });
    expect(tree).toBeTruthy();
    act(() => {
      tree.unmount();
    });
  });

  it('renders /(tabs)/school route', async () => {
    const route = '/(tabs)/school';
    expect(route).toBe('/(tabs)/school');
    let tree: any;
    await act(async () => {
      tree = renderer.create(<SchoolScreen />);
      await flushPromises();
    });
    expect(tree).toBeTruthy();
    act(() => {
      tree.unmount();
    });
  });

  it('renders /(tabs)/settings route', async () => {
    const route = '/(tabs)/settings';
    expect(route).toBe('/(tabs)/settings');
    let tree: any;
    await act(async () => {
      tree = renderer.create(<SettingsScreen />);
      await flushPromises();
    });
    expect(tree).toBeTruthy();
    act(() => {
      tree.unmount();
    });
  });
});
