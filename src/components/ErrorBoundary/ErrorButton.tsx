'use client';
import { useState } from 'react';

export function ErrorButton() {
  const [hasSimulatedError, setHasSimulatedError] = useState(false);

  if (hasSimulatedError) {
    throw new Error('Simulated error by Error Button click.');
  }

  return (
    <button onClick={() => setHasSimulatedError(true)}>Error Button</button>
  );
}
