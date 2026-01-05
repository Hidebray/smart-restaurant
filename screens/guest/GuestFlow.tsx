
import React from 'react';
import { useUserStore } from '../../store/useUserStore';
import GuestTableLogin from './GuestTableLogin';
import GuestMenuScreen from './GuestMenuScreen';

const GuestFlow: React.FC = () => {
  const { tableId } = useUserStore();

  if (!tableId) {
    return <GuestTableLogin />;
  }

  return <GuestMenuScreen />;
};

export default GuestFlow;
