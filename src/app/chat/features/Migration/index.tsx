'use client';

import { Spin } from 'antd';
import { createStore, getMany } from 'idb-keyval';
import dynamic from 'next/dynamic';
import { PropsWithChildren, memo, useEffect, useState } from 'react';

import { MIGRATE_KEY } from './const';

const Modal = dynamic(() => import('./Modal'), { loading: () => <Spin fullscreen />, ssr: false });

const Migration = memo<PropsWithChildren>(({ children }) => {
  const [dbState, setDbState] = useState(null);
  const [open, setOpen] = useState(false);

  const checkMigration = async () => {
    const [state, migrated] = await getMany(
      ['state', MIGRATE_KEY],
      createStore('LobeHub', 'LOBE_CHAT'),
    );

    // if db have migrated already, don't show modal
    if (migrated) return;

    // if db doesn't exist state key,it means a new user
    if (!state) return;

    setDbState(state);
    setOpen(true);
  };

  useEffect(() => {
    checkMigration();
  }, []);

  return (
    <>
      {open && <Modal open={open} setOpen={setOpen} state={dbState} />}
      {children}
    </>
  );
});

export default Migration;
