import React, { FC } from 'react';
import { useContext } from '../../context';
import ReactJson from 'react-json-view';

import BasePage from './BasePage';
import BaseSection from './BaseSection';

const Developer: FC = () => {
  const [context] = useContext();

  return (
    <BasePage title="Developer">
      <BaseSection title="Global State">
        <ReactJson
          src={context}
          theme="monokai"
          collapsed={1}
          collapseStringsAfterLength={200}
          displayDataTypes={false}
          enableClipboard={false} // TODO: Would like to enable the clipboard, but does not work properly
        />
      </BaseSection>
    </BasePage>
  );
};

export default Developer;
