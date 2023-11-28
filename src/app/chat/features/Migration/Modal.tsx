import { Alert, Highlighter, Icon, Modal } from '@lobehub/ui';
import { Button, Result } from 'antd';
import { createStyles } from 'antd-style';
import {BadgeCheck, CpuIcon, DatabaseZap, ShieldAlert} from 'lucide-react';
import Link from 'next/link';
import { rgba } from 'polished';
import { memo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Center, Flexbox } from 'react-layout-kit';

import ExportConfigButton from './ExportConfigButton';
import MigrationStart from './Start';
import UpgradeButton from './UpgradeStatus';
import { UpgradeStatus } from './const';

const useStyles = createStyles(({ css, token, prefixCls }) => ({
  modalTitle: css`
    &.${prefixCls}-modal-header {
      background:
        linear-gradient(180deg, ${rgba(token.colorBgElevated, 0)}, ${token.colorBgContainer} 140px),
        fixed 0 0 /10px 10px radial-gradient(${token.colorFill} 1px, transparent 0);
    }

    & .${prefixCls}-modal-title {
      font-size: 24px;
    }
  `,
  title: css`
    font-size: ${token.fontSizeLG}px;
    font-weight: bold;
  `,
}));

interface MigrationModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  state: any;
}

const MigrationModal = memo<MigrationModalProps>(({ setOpen, open, state: dbState }) => {
  const { t } = useTranslation('migration');
  const { styles } = useStyles();
  const [upgradeStatus, setUpgradeStatus] = useState<UpgradeStatus>(UpgradeStatus.START);

  const [error, setError] = useState<{ message: string; stack: string }>();

  const close = () => {
    setOpen(false);
  };

  const renderContent = () => {
    switch (upgradeStatus) {
      case UpgradeStatus.START:
      case UpgradeStatus.UPGRADING: {
        return (
          <MigrationStart
            setError={setError}
            setUpgradeStatus={setUpgradeStatus}
            state={dbState}
            upgradeStatus={upgradeStatus}
          />
        );
      }
      case UpgradeStatus.UPGRADED: {
        return (
          <Result
            extra={
              <Button onClick={close} size={'large'} type={'primary'}>
                {t('dbV1.action.start')}
              </Button>
            }
            icon={<Icon icon={BadgeCheck} />}
            status={'success'}
            style={{ paddingBottom: 24 }}
            subTitle={t('dbV1.upgrade.success.subTitle')}
            title={t('dbV1.upgrade.success.title')}
          />
        );
      }
      case UpgradeStatus.UPGRADE_FAILED: {
        return (
          <Result
            extra={
              <Flexbox gap={24}>
                {!!error && (
                  <Alert
                    extra={
                      <Highlighter copyButtonSize={'small'} language={'json'}>
                        {JSON.stringify(error)}
                      </Highlighter>
                    }
                    message={error.message}
                    style={{ flex: 1 }}
                    type={'error'}
                  />
                )}
                <Flexbox
                  gap={16}
                  horizontal
                  style={{
                    alignSelf: 'center',
                  }}
                >
                  <ExportConfigButton state={dbState} />

                  <UpgradeButton
                    setError={setError}
                    setUpgradeStatus={setUpgradeStatus}
                    state={dbState}
                    upgradeStatus={upgradeStatus}
                  />
                </Flexbox>
              </Flexbox>
            }
            icon={<Icon icon={ShieldAlert} />}
            status={'error'}
            style={{ paddingBottom: 24, width: 450 }}
            subTitle={
              <Trans i18nKey="dbV1.upgrade.error.subTitle" ns={'migration'}>
                非常抱歉，数据库升级过程发生异常。请重试升级，或
                <Link
                  aria-label={'issue'}
                  href="https://github.com/lobehub/lobe-chat/issues/151"
                  target="_blank"
                >
                  提交问题
                </Link>
                中 ，敬请期待 ✨
              </Trans>
            }
            title={t('dbV1.upgrade.error.title')}
          />
        );
      }
    }
  };

  return (
    <Modal
      centered
      classNames={{
        header: styles.modalTitle,
      }}
      closable={false}
      footer={null}
      open={open}
      title={
        <Flexbox gap={8} horizontal>
          <Icon icon={CpuIcon} />
          {t('dbV1.title')}
        </Flexbox>
      }
      width={550}
    >
      <Center gap={40}>{renderContent()}</Center>
    </Modal>
  );
});

export default MigrationModal;
