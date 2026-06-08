import { useState } from 'react';
import { MainRoute } from './pages/MainRoute/MainRoute';
import { UncontrolledForm } from './pages/UncontrolledForm/UncontrolledForm';
import { ControlledForm } from './pages/ControlledForm/ControlledForm';
import { Modal } from './components/Modal';

export const App = () => {
  const [modalType, setModalType] = useState<
    'uncontrolled' | 'controlled' | null
  >(null);

  return (
    <div>
      <MainRoute
        onOpenUncontrolled={() => setModalType('uncontrolled')}
        onOpenControlled={() => setModalType('controlled')}
      />

      <Modal
        isOpen={modalType === 'uncontrolled'}
        onClose={() => setModalType(null)}
      >
        <UncontrolledForm onSuccess={() => setModalType(null)} />
      </Modal>

      <Modal
        isOpen={modalType === 'controlled'}
        onClose={() => setModalType(null)}
      >
        <ControlledForm onSuccess={() => setModalType(null)} />
      </Modal>
    </div>
  );
};
