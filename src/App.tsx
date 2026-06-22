import { useState } from 'react';
import { MainRoute } from './pages/MainRoute/MainRoute';
import { UncontrolledForm } from './pages/UncontrolledForm/UncontrolledForm';
import { ControlledForm } from './pages/ControlledForm/ControlledForm';
import { Modal } from './components/Modal';

enum ModalType {
  Uncontrolled = 'uncontrolled',
  Controlled = 'controlled',
}

type ActiveModal = ModalType | null;

export const App = () => {
  const [modalType, setModalType] = useState<ActiveModal>(null);

  return (
    <div>
      <MainRoute
        onUncontrolledFormOpen={() => setModalType(ModalType.Uncontrolled)}
        onControlledFormOpen={() => setModalType(ModalType.Controlled)}
      />

      <Modal
        isOpen={modalType === ModalType.Uncontrolled}
        onClose={() => setModalType(null)}
      >
        <UncontrolledForm onSuccess={() => setModalType(null)} />
      </Modal>

      <Modal
        isOpen={modalType === ModalType.Controlled}
        onClose={() => setModalType(null)}
      >
        <ControlledForm onSuccess={() => setModalType(null)} />
      </Modal>
    </div>
  );
};