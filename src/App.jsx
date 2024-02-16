import './App.css';
import {
  Tab,
  TabGroup,
  TabList,
  TabPanels,
  Flex,
} from '@tremor/react';

import SettingsModal from './components/SettingsModal';
import Daily from './components/Daily';
import Resources from './components/Resources';

function App() {
  return (
    <main className="w-screen min-h-screen">
      <div className="App">
        <header className="App-header">
          <h1>Notium</h1>
        </header>
        <SettingsModal />
        <Flex className="w-11/12 h-11/12">
          <TabGroup>
            <Flex className="w-full h-1/12">
              <TabList variant="solid" defaultValue="1">
                <Tab value="1">Daily</Tab>
                <Tab value="2">Resources</Tab>
              </TabList>
            </Flex>
            <TabPanels>
              <Daily />
              <Resources />
            </TabPanels>
          </TabGroup>
        </Flex>
      </div>
    </main>
  );
}

export default App;
