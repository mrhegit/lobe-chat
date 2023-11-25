import { RenderMessage } from '@lobehub/ui';
import { memo } from 'react';

import { useChatStore } from '@/store/chat';
import { chatSelectors } from '@/store/chat/selectors';
import { isFunctionMessageAtStart } from '@/utils/message';

import Inspector from '../Plugins/Inspector';
import { DefaultMessage } from './Default';

export const AssistantMessage: RenderMessage = memo(({ id, plugin, content, ...props }) => {
  const fcProps = useChatStore(chatSelectors.getFunctionMessageProps({ content, id, plugin }));

  if (!isFunctionMessageAtStart(content))
    return <DefaultMessage content={content} id={id} {...props} />;

  return (
    <div id={id}>
      <Inspector {...fcProps} />
    </div>
  );
});
