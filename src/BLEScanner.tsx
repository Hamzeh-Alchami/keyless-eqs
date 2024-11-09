// BLEScanner.tsx
import React, { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

const manager = new BleManager();

const BLEScanner = () => {
  const [isNearCar, setIsNearCar] = useState(false);
  const targetUUID = 'AA4E 3003-FAA4 578A-A14BDOFB-0A87 73B9'.toLowerCase();

  useEffect(() => {
    requestPermissions();
    startScan();

    // Cleanup on unmount
    return () => {
      manager.stopDeviceScan();
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      const allGranted = Object.values(granted).every(
        (status) => status === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        Alert.alert('Permission required', 'Bluetooth permissions are required.');
      }
    }
  };

  const startScan = () => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        Alert.alert(error?.message);
        return;
      }

      if (device) {
        // Check for the target UUID in the advertisement data
        const serviceUUIDs = device.serviceUUIDs || [];
        if (serviceUUIDs.includes(targetUUID)) {
          // Determine proximity based on RSSI
          if (device.rssi && device.rssi > -70) {
            if (!isNearCar) {
              setIsNearCar(true);
              unlockCar();
            }
          } else {
            if (isNearCar) {
              setIsNearCar(false);
              lockCar();
            }
          }
        }
      }
    });
  };

  const unlockCar = () => {
    // Implement API call to unlock car
    console.log('Unlocking car...');
    // Call Mercedes-Benz API here
  };

  const lockCar = () => {
    // Implement API call to lock car
    console.log('Locking car...');
    // Call Mercedes-Benz API here
  };

  return null; // No UI components needed for scanning
};

export default BLEScanner;
