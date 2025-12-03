
import { useEffect, useRef } from 'react';
import { driver, Driver } from 'driver.js';
import "driver.js/dist/driver.css";
import { DriveStep } from 'driver.js';

interface UseTourProps {
  steps: DriveStep[];
  startOnMount?: boolean;
  onFinish?: () => void;
  storageKey?: string; // If provided, ensures tour only runs once per key
}

export const useTour = ({ steps, startOnMount = false, onFinish, storageKey }: UseTourProps) => {
  const driverRef = useRef<Driver | null>(null);

  useEffect(() => {
    driverRef.current = driver({
      showProgress: true,
      steps: steps,
      onDestroyStarted: () => {
        if (driverRef.current?.hasNextStep() === false) {
           driverRef.current.destroy();
           if(onFinish) onFinish();
        } else {
           driverRef.current?.destroy();
        }
      },
    });

    if (startOnMount) {
        if (storageKey) {
            const hasRun = localStorage.getItem(`tour_has_run_${storageKey}`);
            if (!hasRun) {
                driverRef.current.drive();
                localStorage.setItem(`tour_has_run_${storageKey}`, 'true');
            }
        } else {
            driverRef.current.drive();
        }
    }

    return () => {
      driverRef.current?.destroy();
    };
  }, [steps, startOnMount, onFinish, storageKey]);

  const startTour = () => {
    driverRef.current?.drive();
  };

  return { startTour, driver: driverRef.current };
};
