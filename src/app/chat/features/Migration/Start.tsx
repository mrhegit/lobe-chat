import { Icon } from '@lobehub/ui';
import { createStyles } from 'antd-style';
import { Database, SearchCheck, Zap } from 'lucide-react';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Center, Flexbox } from 'react-layout-kit';

import ExportConfigButton from './ExportConfigButton';
import UpgradeButton, { UpgradeButtonProps } from './UpgradeStatus';

const useStyles = createStyles(({ css, token }) => ({
  desc: css`
    color: ${token.colorTextSecondary};
  `,
  hint: css`
    font-size: ${token.fontSizeSM}px;
    color: ${token.colorTextTertiary};
  `,
  icon: css`
    color: ${token.geekblue};
  `,
  iconCtn: css`
    width: 72px;
    height: 72px;
    background: ${token.geekblue1};
    border-radius: 50%;
  `,

  title: css`
    font-size: ${token.fontSizeLG}px;
    font-weight: bold;
  `,
}));

const MigrationStart = memo<UpgradeButtonProps>((props) => {
  const { t } = useTranslation('migration');
  const { styles } = useStyles();

  const features = [
    {
      avatar: Database,
      desc: t('dbV1.features.capability.desc'),
      title: t('dbV1.features.capability.title'),
    },
    {
      avatar: Zap,
      desc: t('dbV1.features.performance.desc'),
      title: t('dbV1.features.performance.title'),
    },
    {
      avatar: SearchCheck,
      desc: t('dbV1.features.use.desc'),
      title: t('dbV1.features.use.title'),
    },
  ];

  return (
    <>
      <Flexbox>
        <p>{t('dbV1.description')}</p>
      </Flexbox>
      <Flexbox gap={24}>
        {features.map((item) => {
          return (
            <Flexbox align={'center'} gap={24} horizontal key={item.title}>
              <Center className={styles.iconCtn}>
                <Icon className={styles.icon} icon={item.avatar} size={{ fontSize: 36 }} />
              </Center>
              <Flexbox gap={8}>
                <p className={styles.title}>{item.title}</p>
                <p className={styles.desc}>{item.desc}</p>
              </Flexbox>
            </Flexbox>
          );
        })}
      </Flexbox>
      <Flexbox align={'center'} gap={8}>
        <Flexbox gap={16} horizontal>
          <ExportConfigButton state={props.state} />
          <UpgradeButton {...props} />
        </Flexbox>
        <Flexbox align={'center'} className={styles.hint}>
          <p>{t('dbV1.upgradeTip')}</p>
          <p>{t('upgradeWarning')}</p>
        </Flexbox>
      </Flexbox>
    </>
  );
});

export default MigrationStart;
