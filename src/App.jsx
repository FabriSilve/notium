import './App.css';
import {
  Tab,
  TabGroup,
  TabList,
  TabPanels,
  TabPanel,
  LineChart,
  Card,
  // BarList,
  Flex,
} from '@tremor/react';

import SettingsModal from './components/SettingsModal';

/* const timeSpentOn = [
  { name: 'Features', value: 456 },
  { name: 'Bug fixes', value: 351 },
  { name: 'Unplanned', value: 51 },
];

const chartdata = [
  {
    day: 'Tuesday',
    Ideal: 16,
    Actual: 16,
  },
  {
    day: 'Wednesday',
    Ideal: 24,
    Actual: 22,
  },
  {
    day: 'Thursday',
    Ideal: 40,
    Actual: 23,
  },
  {
    day: 'Friday',
    Ideal: 56,
    Actual: 60,
  },
  {
    day: 'Monday',
    Ideal: 72,
    Actual: 72,
  },
  {
    day: 'Tuesday',
    Ideal: 88,
    Actual: 87,
  },
  {
    day: 'Wednesday',
    Ideal: 104,
    Actual: 102,
  },
  {
    day: 'Thursday',
    Ideal: 120,
    Actual: 122,
  },
  {
    day: 'Friday',
    Ideal: 137,
    Actual: 137,
  },
  {
    day: 'Monday',
    Ideal: 152,
    Actual: 152,
  },
];

const valueFormatter = function (number) {
  return number + ' points ';
}; */

export function BurndownChart() {
  return (
    <>
      <h3 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Burndown chart</h3>
      {/*<LineChart
        className="mt-6 h-72"
        data={chartdata}
        index="day"
        yAxisWidth={65}
        categories={['Ideal', 'Actual']}
        colors={['red', 'cyan']}
        valueFormatter={valueFormatter}
  /> */}
    </>
  );
}

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
                    <Tab value="2">Dashboard</Tab>
                  </TabList>
                </Flex>
                <TabPanels>
                  <TabPanel>
                    <Flex 
                      className="w-full"
                      flexDirection="row"
                    >
                      <Card/>
                        {/*<BurndownChart />*/}
                      <Card/>
                        {/*<BarList data={timeSpentOn} className="mx-auto max-w-sm" />*/}
                    </Flex>
                  </TabPanel>
                <TabPanel>
                  <p className="mt-4 leading-6 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    kfmksdlm lklkem klapwwowrji hn vmdl momaodpas.
                  </p>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </Flex>
        </div>
    </main>
  );
}

export default App;
